const sgMail = require('@sendgrid/mail');

// SendGrid mailing 
sgMail.setApiKey(process.env.SENDGRID_API_KEY);


function sendBookingPending(booking) {
    const { treatment, date, patientEmail, patientName } = booking;
    const msg = {
        to: patientEmail,
        from: 'nayanchdatta11@gmail.com',
        subject: `Booking Pending for ${treatment}`,
        text: `Booking Pending for ${treatment}`,
        html: `
        <div>
            <h4>Hello, ${patientName}</h4>
            <h2>Booking pending for ${treatment} on ${date}</h2>
            <p>Once the doctor confrim your appointment, you'll get an email confirmation.</p>
            
            <br/><br/>
            <h3>Doctors Portal</h3>
            <p>Visit our site for more information.</p>
        </div>
        `,
    };

    sgMail
        .send(msg)
        .then()
        .catch((error) => {
            console.error(error)
        })
}
function sendBookingConfirmation(booking) {
    const { treatment, doctor, date, slot, patientEmail, patientName } = booking;
    const msg = {
        to: patientEmail,
        from: 'nayanchdatta11@gmail.com',
        subject: `Appointment confirmed for ${treatment}`,
        text: `Appointment confirmed for ${treatment}`,
        html: `
        <div>
            <h4>Hello, ${patientName}</h4>
            <h2>Appointment Confirmation for ${treatment}</h2>
            <p>Appointment Date: ${date}</p>
            <p>Appointment Slot: ${slot}</p>
            <p>Appointment Doctor: ${doctor}</p>
            <p>Please be present on exact date and time with previous health records.</p>

            <br/><br/>
            <h3>Doctors Portal</h3>
            <p>Visit our site for more information.</p>
        </div>
        `,
    };

    sgMail
        .send(msg)
        .then()
        .catch((error) => {
            console.error(error)
        })
}
function sendBookingCancel(booking) {
    const { treatment, date, patientEmail, patientName } = booking;
    const msg = {
        to: patientEmail,
        from: 'nayanchdatta11@gmail.com',
        subject: `Appointment Cancelled for ${treatment}`,
        text: `Appointment Cancelled for ${treatment}`,
        html: `
        <div>
            <h4>Hello, ${patientName}</h4>
            <h2>Appointment Cancelled for ${treatment} on ${date}</h2>

            <br/><br/>
            <h3>Doctors Portal</h3>
            <p>Visit our site for more information.</p>
        </div>
        `,
    };

    sgMail
        .send(msg)
        .then()
        .catch((error) => {
            console.error(error)
        })
}


module.exports = { sendBookingPending, sendBookingCancel, sendBookingConfirmation };