const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const { OAuth2 } = google.auth;
const { CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN, EMAIL } = process.env;

module.exports = class Email {
  constructor(user, url) {
    // Set user email, first name, URL, and the sender's email
    this.to = user.email;
    this.firstName = user.name.split(" ")[0];
    this.url = url;
    this.from = `MERN-Blog <${EMAIL}>`;
  }

  async newTransport() {
    // Create OAuth2 client with credentials
    const oAuth2Client = new OAuth2(
      CLIENT_ID,
      CLIENT_SECRET,
      "https://developers.google.com/oauthplayground" // Redirect URI
    );

    // Set OAuth2 client credentials
    oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

    // Get access token
    const accessToken = await oAuth2Client.getAccessToken();

    // Return nodemailer transport configured with OAuth2
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

  // Send the actual email
  async send(html, subject) {
    // Define email options
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

  // Send a verification email
  async sendWelcome() {
    // Define HTML content for welcome email
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

    // Send the email
    await this.send(html, "Welcome to MERN Blog! Please Verify Your Email");
  }

  // Send a password reset email
  async sendPasswordReset() {
    // Define HTML content for password reset email
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
    await this.send(
      html,
      "Your password reset token (valid only for 10 minutes)"
    );
  }
};
