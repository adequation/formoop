import nodemailerConfig from "@/nodeMailerConfig";
import * as nodemailer from "nodemailer";

//Returns a node mailer transporter from properties, such as service and auth
export function getTransporter(properties){
  return nodemailer.createTransport(properties);
}

//Returns a node mailer transporter from our config file properties
export function getTransporterFromConfig(){
  return getTransporter(nodemailerConfig.transporter);
}

//Builds and returns the mail options
//This function can easily be replaced by an object
export function getMailOptions(from, to, subject, html){
  return {
    from, // sender address
    to, // list of receivers
    subject, // Subject line
    html// plain text body
  }
}

//Send an email from the given transporter
export function sendMailFromTransporter(transporter, mailOptions){
  transporter.sendMail(mailOptions, function (err, info) {
    if(err)
      console.log(err);
    else
      console.log(info);
  });
}

//Send an email from the config file transporter
export function sendMailFromConfig(mailOptions){
  const transporter = getTransporterFromConfig();
  sendMailFromTransporter(transporter, mailOptions);
}
