function documentReady(callback) {
    if (document.readyState === "complete" || document.readyState === "interactive") {
        callback();
    } else {
        document.addEventListener("DOMContentLoaded", callback);
    }
}

documentReady(() => {
  const getAuth0Token = () => {
    if ( window.getAuth0Client ) {
      return window.getAuth0Client().then(client => {
        return client.getUser().then(user => {
          if ( user ) {
            return client.getTokenSilently()
          } else {
            return undefined
          }
        })
      })
    } else {
      return Promise.resolve(undefined)
    }
  }

  let auth0Token = undefined

  const fetchTokenButton = document.getElementById("fetchToken");
  const deleteTokenButton = document.getElementById("deleteToken");
  const callLambdaButton = document.getElementById("callLambda");

  const tokenOutput = document.getElementById("tokenOutput");
  const lambdaOutput = document.getElementById("lambdaOutput");

  fetchTokenButton.addEventListener("click", () => {
    getAuth0Token().then(token => {
      if ( token ) {
        tokenOutput.innerText = token
        auth0Token = token
      } else {
        tokenOutput.innerText = "--none--"
      }
    })
  })

  deleteTokenButton.addEventListener("click", () => {
    auth0Token = undefined
    tokenOutput.innerText = "--none--"
  })

  callLambdaButton.addEventListener("click", () => {
    window.fetch(
      "https://ohqzl3ca3k.execute-api.eu-central-1.amazonaws.com/default/valuecase-bubble-auth0-token-validator"+
      "?auth0_token="+encodeURIComponent(auth0Token || ""),
      {}
    ).then(response => {
      return response.json()
    }).then(json => {
      lambdaOutput.value = JSON.stringify(json, null, 2)
    })
  })

  tokenOutput.innerText = "--none--"
  lambdaOutput.value = "--none--"
});
