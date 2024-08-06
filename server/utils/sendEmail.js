const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const { OAuth2 } = google.auth;
const { CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN, EMAIL } = process.env;

// Email class for handling email sending
module.exports = class Email {
  constructor(user, url) {
    // Initialize the email properties
    this.to = user.email; // Recipient's email address
    this.firstName = user.name.split(" ")[0]; // Extract the recipient's first name
    this.url = url; // URL for email verification or password reset
    this.from = `MERN-Blog <${EMAIL}>`; // Sender's email address
  }

  // Create a new transport using OAuth2 for secure email sending
  async newTransport() {
    // Create an OAuth2 client with Google API credentials
    const oAuth2Client = new OAuth2(
      CLIENT_ID,
      CLIENT_SECRET,
      "https://developers.google.com/oauthplayground" // Redirect URI for OAuth2
    );

    // Set OAuth2 client credentials
    oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

    // Obtain the access token
    const accessToken = await oAuth2Client.getAccessToken();

    // Return a nodemailer transport configured with OAuth2
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: EMAIL,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken,
      },
    });
  }

  // Send an email with specified HTML content and subject
  async send(html, subject) {
    // Define email options including sender, recipient, subject, and HTML content
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
    };

    // Create a transport and send the email
    const transport = await this.newTransport();
    await transport.sendMail(mailOptions);
  }

  // Send a welcome email to new users
  async sendWelcome() {
    // Define HTML content for the welcome email
    const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; padding: 20px; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #333; text-align: left;">Welcome to Our Blog!</h1>
      <p style="text-align: left; font-size: 16px;">Hi ${this.firstName},</p>
      <p style="text-align: left; margin: 20px 0;">Thank you for signing up! To complete your registration, please verify your email address by clicking the button below:</p>
      <div style="text-align: left; margin: 20px 0;">
        <a href="${this.url}" style="display: inline-block; padding: 12px 20px; font-size: 16px; color: #fff; background-color: #007bff; text-decoration: none; border-radius: 5px; text-align: center;">
          Verify Your Email
        </a>
      </div>
      <p style="text-align: left;">If you have any questions, feel free to <a href="mailto:support@yourblog.com" style="color: #007bff; text-decoration: none;">contact our support team</a>.</p>
      <p style="text-align: left;">Happy Blogging!</p>
      <p style="text-align: left;">The MERN Blog Team</p>
    </div>
    `;

    // Send the welcome email
    await this.send(html, "Welcome to MERN Blog! Please Verify Your Email");
  }

  // Send a password reset email
  async sendPasswordReset() {
    // Define HTML content for the password reset email
    const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; padding: 20px; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #333; text-align: left;">Password Reset Request</h1>
      <p style="text-align: left; font-size: 16px;">Hi ${this.firstName},</p>
      <p style="text-align: left; margin: 20px 0;">We received a request to reset your password. If you did not request this, please ignore this email. If you did, click the button below to reset your password:</p>
      <div style="text-align: left; margin: 30px 0;">
        <a href="${this.url}" style="display: inline-block; padding: 12px 20px; font-size: 16px; color: #fff; background-color: #007bff; text-decoration: none; border-radius: 5px; text-align: center;">
          Reset Password
        </a>
      </div>
      <p style="text-align: left;">This link is valid for only 10 minutes. After that, it will expire and you will need to request a new password reset.</p>
      <p style="text-align: left;">If you have any questions, feel free to <a href="mailto:support@yourblog.com" style="color: #007bff; text-decoration: none;">contact our support team</a>.</p>
      <p style="text-align: left;">Best regards,</p>
      <p style="text-align: left;">The MERN Blog Team</p>
    </div>
    `;

    // Send the password reset email
    await this.send(
      html,
      "Your password reset token (valid only for 10 minutes)"
    );
  }
};
