
const axios = require('axios');

const tcUrl = process.env.TC_URL;

async function login() {
  const headers = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  const body = {
    email: process.env.AMANA_USER,
    password: process.env.AMANA_PASS
  };
  return await axios.post('https://api.amana.fun/auth/login', body, headers);
}

async function getAllBuildConfig() {
  const {data} = await login();
  const {accessToken} = data;
  const headers = {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  };
  return await axios.get('https://api.amana.fun/app-builds/configs', headers);
}

function callBuild(bot, projectKey, jsonValue) {
  const {teamCityToken} = jsonValue;
  const bodyXml = getBodyXml(projectKey, jsonValue);
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${teamCityToken}`,
      'Content-Type': 'application/xml'
    }
  };
  const url = `${tcUrl}/app/rest/buildQueue`;
  axios.post(url, bodyXml, axiosConfig)
    .then((data) => {
      console.log('call api build success');
      bot.reply('Yes sir! Your request has been added to the queue, please wait a moment')
    })
    .catch((err) => {
      bot.reply('Ah ha!! Error happen. Sorry! I can not build');
      console.log(err)
    })
}

function getBodyXml(projectKey, jsonValue) {
  const {env} = jsonValue;
  return `<build>
    <buildType id='${projectKey}'/>
    <properties>
        <property name='env' value='${env}'/>
    </properties>
</build>`
}

module.exports = async (robot) => {
  try {
    const listConfig = await getAllBuildConfig();
    const {data} = listConfig;
    data.forEach((config) => {
      const {projectKey, jsonValue} = config;
      const botCmd = new RegExp(`build ${projectKey}`);
      console.log(`projectKey => ${projectKey}`);
      robot.respond(botCmd, (res) => {
        callBuild(res, projectKey, jsonValue)
      })
    })
  } catch (e) {
    console.log(e);
  }
};
