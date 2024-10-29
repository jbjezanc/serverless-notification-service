import AWS from "aws-sdk"

// Create new instance of SES class, which is a client
// that allows us to send emails
const ses = new AWS.SES({ region: "eu-central-1" })

async function sendMail(event, context) {
  // Collect the records from event.Records, we only have one
  // message at a time
  const record = event.Records[0]
  console.log("record processing", record)

  // body - a stringified object since SQS can only send strings
  const email = JSON.parse(record.body)
  const { subject, body, recipient } = email

  // Send a test email
  const params = {
    Source:
      "<your_registered_and_verified_AWS_SES_Identities_email>",
    Destination: {
      ToAddresses: [recipient],
    },
    Message: {
      Body: {
        Text: {
          Data: body,
        },
      },
      Subject: {
        Data: subject,
      },
    },
  }

  try {
    const result = await ses.sendEmail(params).promise()
    console.log(result)
    return result
  } catch (error) {
    console.error(error)
  }
}

export const handler = sendMail
