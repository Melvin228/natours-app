/* eslint-disable*/
import axios from 'axios';
import { showAlert } from './alert.js';

const stripe = Stripe('');

export const bookTour = async tourId => {
  try {
    //1) Get the session from the server
    const sesion = await axios(`/api/v1/bookings/checkout-session/${tourId}`);

    //2)Create checkout form + change credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
