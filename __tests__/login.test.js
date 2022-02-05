import 'react-native'
import React from 'react'
import SignInScreen from '../src/screens/Authentification/SignInScreen';
import { fireEvent, waitFor} from '@testing-library/react-native';
import { render } from 'react-native-testing-library';
import { Alert } from 'react-native';
import firebase from 'firebase'


const firebaseConfig = {
  apiKey: "AIzaSyAF_rY_VHwjw_sHV-XTwQtxyrx-L1r1XoE",
  authDomain: "shoppinglist-6cc7b.firebaseapp.com",
  projectId: "shoppinglist-6cc7b",
  storageBucket: "shoppinglist-6cc7b.appspot.com",
  messagingSenderId: "899980789044",
  appId: "1:899980789044:web:437a9d1df1252be5abd161",
  measurementId: "G-F5XJDKGDKF"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}


describe('SignInScreen tests', () => {
  it('should renders default elements', () => {
    const { getAllByText } = render(<SignInScreen />);

  });

});



describe('SignInScreen tests', () => {
  it('should return The email address is badly formatted when entering password empty with empty email', async () => {
    const email = '';
    const { getByTestId, getByRole } = render(<SignInScreen />)

    const emailInput = getByTestId("TEST_ID_EMAIL_INPUT");
    const button = getByTestId("TEST_ID_BUTTON_SUBMIT");

    await waitFor(() => {
      fireEvent.changeText(emailInput, email),
        expect(emailInput.props.value).toBe(email);
      fireEvent.press(button);
      jest.spyOn(Alert, 'alert');
      expect(Alert.alert).toHaveBeenCalledWith("The email address is badly formatted.")
    })

  });
});

describe('SignInScreen tests', () => {
  it('should return The password is invalid when entering empty password with valid email', async () => {
    const email = 'id@gmail.com';
    const { getByTestId, getByRole } = render(<SignInScreen />)

    const emailInput = getByTestId("TEST_ID_EMAIL_INPUT");
    const button = getByTestId("TEST_ID_BUTTON_SUBMIT");

    await waitFor(() => {
      fireEvent.changeText(emailInput, email),
        expect(emailInput.props.value).toBe(email);
      fireEvent.press(button);
      jest.spyOn(Alert, 'alert');
      expect(Alert.alert).toHaveBeenCalledWith("The password is invalid or the user does not have a password.")
    })

  });
});



describe('SignInScreen tests', () => {
  it('should return The password is invalid when entering wrong password with valid email', async () => {
    const email = 'id@gmail.com';
    const { getByTestId, getByRole } = render(<SignInScreen />)
    const password = '123456';

    const emailInput = getByTestId("TEST_ID_EMAIL_INPUT");
    const button = getByTestId("TEST_ID_BUTTON_SUBMIT");
    const passwordInput = getByTestId("TEST_ID_PASSWORD_INPUT");
    await waitFor(() => {
      fireEvent.changeText(emailInput, email),

        fireEvent.changeText(passwordInput, password),
        expect(emailInput.props.value).toBe(email);

      expect(passwordInput.props.value).toBe(password);

      fireEvent.press(button);
      jest.spyOn(Alert, 'alert');
      expect(Alert.alert).toHaveBeenCalledWith("The password is invalid or the user does not have a password.")
    })
  });
});

