import { Injectable } from '@angular/core';
import { applyActionCode, Auth, confirmPasswordReset, createUserWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, user, UserCredential } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthFirebaseService {

  userCredential: any;
  confirmationResult: any;

  constructor(
    private _fireAuth: Auth
  ) { }

  async createUserWithEmailAndPassword(email, password) {
    try {
      const userCredential = await createUserWithEmailAndPassword(this._fireAuth, email, password);
      this.userCredential = userCredential;

      await sendEmailVerification(userCredential.user);

      return userCredential;
    } catch (e) { throw (e) }
  }

  async signInWithEmailAndPassword(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(this._fireAuth, email, password);
      this.userCredential = userCredential;

      return userCredential;
    } catch (e) {
      throw (e?.message);
    }
  }

  async sendEmailVerification(user) {
    try {
      await sendEmailVerification(user);
    } catch (e) {
      throw (e?.message)
    }
  }

  async applyActionCode(oobCode) {
    try {
      const response = await applyActionCode(this._fireAuth, oobCode);
      return response;
    } catch (e) {
      throw (e);
    }
  }

  async verifyOtp(otp) {
    try {
      const result = await this.confirmationResult.confirm(otp);
      console.log(result);
      const user = result?.user;
      console.log(user);
    } catch (e) {
      throw (e?.message);
    }
  }

  async sendPasswordResetEmail(email) {
    try {
      const response = await sendPasswordResetEmail(this._fireAuth, email);
      return response;
    } catch (e) {
      throw (e);
    }
  }
  
  async confirmPasswordReset(oobCode, newPassword) {
    try {
      const response = await confirmPasswordReset(this._fireAuth, oobCode, newPassword);
      return response;
    } catch (e) {
      throw (e);
    }
  }

}
