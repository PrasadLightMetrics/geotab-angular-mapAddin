export const environment = {
  production: false,
  legacy_api_server_url: 'http://localhost:2999',
  intermediate_server_url: 'http://localhost:6001',
  redirect_url: '',
  clientID: '',
  domain: '',
  callbackURL: '',
  region: 'us-east-1',
  scopes: ['email', 'openid', 'profile', 'aws.cognito.signin.user.admin'],
};

export class API {
  public static INTERMEDIATE_SERVER_URL = environment.intermediate_server_url;
  // DVR and E-DVR requests
  public static GET_DVR_REQUESTS =
    API.INTERMEDIATE_SERVER_URL + '/fleet-upload-requests';
  public static GET_EDVR_REQUESTS =
    API.INTERMEDIATE_SERVER_URL + '/fleet-edvr-requests';
  // External Events
  public static GET_EXTERNAL_EVENTS =
    API.INTERMEDIATE_SERVER_URL + '/external-events';
    public static GET_VIOLATIONS = `${API.INTERMEDIATE_SERVER_URL}/geotab/asset-violations-list`;
}
