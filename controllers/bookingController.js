const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Tour = require('./../models/tourModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');
const AppError = require('./../utils/appError');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  //1) Get the currently booked tour
  const tour = await Tour.findById(req.params.tourId);

  //2) Create checkout session
  const session = await stripe.checkout.session.create({
    payment_method_type: ['card'],
    success_url: `${req.protocol}//${req.get('host')}/?tour=${
      req.params.tourId
    }&user=${req.user.id}&price=${tour.price}`,
    cancel_url: `${req.protocol}//${req.get('host')}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference: req.params.tourId,
    line_items: [
      {
        name: `${tour.name} Tour`,
        description: tour.summary,
        images: [
          `https://www.google.com/imgres?imgurl=https%3A%2F%2Fimages.unsplash.com%2Fphoto-1615789591457-74a63395c990%3Fixid%3DMnwxMjA3fDB8MHxzZWFyY2h8MXx8ZG9tZXN0aWMlMjBjYXR8ZW58MHx8MHx8%26ixlib%3Drb-1.2.1%26w%3D1000%26q%3D80&imgrefurl=https%3A%2F%2Funsplash.com%2Fs%2Fphotos%2Fdomestic-cat&tbnid=--16yG3LYPKNHM&vet=12ahUKEwj4-Nr_xu_zAhVyN7cAHc7ECNEQMygCegUIARDNAQ..i&docid=rNJwENmHQ-ZHoM&w=1000&h=1500&q=cat%20images&ved=2ahUKEwj4-Nr_xu_zAhVyN7cAHc7ECNEQMygCegUIARDNAQ`
        ],
        amount: tour.price * 100,
        currency: 'usd',
        quantity: 1
      }
    ]
  });
  //3) Create session as response
  res.status(200).json({
    status: 'success',
    session
  });
});

exports.createBookingCheckout = catchAsync(async (req, res, next) => {
  const { tour, user, price } = req.query;

  if (!tour && !user && !price) return next();

  await Booking.create({ tour, user, price });

  res.redirect(req.originalUrl.split('?')[0]);
  next();
});
