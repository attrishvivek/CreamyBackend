var in_client_id = '635492554167577',
		in_client_secret = 'be5ec63f37ed321402e076ad561af854',
		in_redirect_uri = 'http://localhost:3000/auth/instagram/callback',
		in_auth_url = 'https://api.instagram.com/oauth/authorize/?client_id=' + in_client_id + '&redirect_uri=' + in_redirect_uri + '&response_type=code'



module.exports = {

	/* port: process.env.PORT || 4000,
	db: {
		uri: db_uri
	}, */
	instagram: {
		client_id: in_client_id,
		client_secret: in_client_secret,
		auth_url: in_auth_url,
		redirect_uri: in_redirect_uri
	}

};