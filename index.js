'use strict';

require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const Smooch = require('smooch-core');
const jwt = require('jsonwebtoken');

const APP_ID = process.env.APP_ID;
const APP_KEY_ID = process.env.APP_KEY_ID;
const APP_SECRET = process.env.APP_SECRET;
const SERVICE_URL = process.env.SERVICE_URL;

const smooch = new Smooch({
	scope: 'app',
	keyId: APP_KEY_ID,
	secret: APP_SECRET
});

express()
	.use(express.static('public'))
	.use(bodyParser.json())
	.post('/api/webhooks', webhookHandler)
	.listen(process.env.PORT, () => console.log(`Listening on port ${process.env.PORT}`));

async function webhookHandler(req, res) {
	const id = req.body.appUser._id;


	/*
		If the app user has a userId property, then the SDKs login method will be suffecient
		to authenticate them and we should not generate and send a link with an auth code.
	*/

	if (req.body.appUser.userId) {
		await smooch.appUsers.sendMessage(id, {
			text: 'Hi again returning user!',
			type: 'text',
			role: 'appMaker',
		});

		return res.end();
	}


	/*
		We generate an auth code to link a Web Messenger client to the app user.
	*/

	const authCode = (await smooch.appUsers.getAuthCode(id)).authCode;


	/*
		We generate a JWT to facilitate login to the Web SDK. This is done to illustrate login
		using the Web messenger, but under normal circumstances you would pass this to token to
		the user session on your website once they had completed your own login flow.
	*/

	const token = jwt.sign({ scope: 'appUser', userId: id }, APP_SECRET, { header: { kid: APP_KEY_ID }});

	await smooch.appUsers.sendMessage(id, {
		text: 'Connect to me on the Web',
		type: 'text',
		role: 'appMaker',
		actions: [{
			type: 'link',
			text: 'Connect',
			uri: `${SERVICE_URL}?authCode=${authCode}&id=${id}&token=${token}&appId=${APP_ID}`
		}]
	});

	res.end();
}
