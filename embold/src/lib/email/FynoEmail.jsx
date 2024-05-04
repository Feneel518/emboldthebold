import { Fyno } from "@fyno/node";

export const fyno = new Fyno(
  "FYAPC6EAF9268IN",
  "1epnF7K.GD2HEgB4WzMfBQRdhyPn2fndkVlrNtgv",
  "live"
);

export const sendEmail = (email, name, appurl) => {
  fyno.fire("passwordReset", {
    to: {
      email: email,
    },
    data: {
      name: name,
      appurl: appurl,
      key: "value",
    },
  });
};
