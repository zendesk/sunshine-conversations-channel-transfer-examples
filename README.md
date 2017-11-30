# Smooch Channel Transfer Examples

This project shows how to use Smooch's channel transfer feature to link a user across multiple messaging channels. This project highlights two ways this can be done:

1) Moving a user from a social channel like Facebook Messenger to an embedded chat in a Web app.

2) Moving a user from a web chat to a social channel like Facebook Messenger.

For more information on this feature, see this [guide](https://docs.smooch.io/guide/channel-transfer/).

## Get started

1. Create a _config.json_ file in the project's root based on the contents of _config.json.example_.

2. Configure a webhook to point from your Smooch app to a publicly accessible endpoint, _/api/webhooks_, on this service.

3. Change directory to either _social-to-web_ or _web-to-social_ and `npm install` and `npm start` to run the project.

### Trying social-to-web

1. Make sure you have a social channel like Facebook Messenger configured on your Smooch app.

2. Visit that channel as an end-user and send a message.

### Trying web-to-social

1. Make sure you have a social channel like Facebook Messenger configured on your Smooch app.

2. In your browser, visit _localhost:8000_ or whatever host this service is deployed to and initiate a conversation over the Web messenger.
