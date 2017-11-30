'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const Smooch = require('smooch-core');
const config = require('../config.json');
const renderWebMessenger = require('./render_web_messenger');

const APP_ID = config.APP_ID;
const ACCOUNT_KEY_ID = config.ACCOUNT_KEY_ID;
const ACCOUNT_SECRET = config.ACCOUNT_SECRET;

const smooch = new Smooch({
	scope: 'account',
	keyId: ACCOUNT_KEY_ID,
	secret: ACCOUNT_SECRET
});

express()
	.use(bodyParser.json())
	.get('/', serveWebMessenger)
	.post('/api/webhooks', webhookHandler)
	.listen(config.PORT, () => console.log(`Listening on port ${config.PORT}`));


function serveWebMessenger(req, res) {
	res.send(renderWebMessenger(APP_ID));
}

async function webhookHandler(req, res) {
	/*
		Send an option to connect to every channel for which linking is possible.
	*/
	if (req.body.trigger === 'message:appUser') {
		const id = req.body.appUser._id;
	    const integrationIds = (await smooch.integrations.list(APP_ID))
	    	.integrations
	        .map((integration) => integration._id);

	    const linkData = await smooch.appUsers.getLinkRequests(APP_ID, id, integrationIds);
	    const actions = linkData.linkRequests
	        .map((linkRequest) => ({
	            type: 'link',
	            text: linkRequest.type,
	            uri: linkRequest.url
	        }));

	    await smooch.appUsers.sendMessage(APP_ID, id, {
	        type: 'text',
	        role: 'appMaker',
	        text: 'Join me on:',
	        actions
	    });
		return res.end();
	}

	/*
		Send a greeting when linking is complete.
	*/
	if (req.body.trigger === 'client:add') {
		const id = req.body.appUser._id;

	    await smooch.appUsers.sendMessage(APP_ID, id, {
	        type: 'text',
	        role: 'appMaker',
	        text: 'Welcome to ' + req.body.clients
	        	.map((client) => client.platform)
	        	.join(' and ')
	    });
		return res.end();;
	}

	res.end();
}
