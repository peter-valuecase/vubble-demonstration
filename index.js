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
        return client.getTokenSilently()
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
      "https://44g5tybeo1.execute-api.eu-central-1.amazonaws.com/default/valuecase-bubble-auth0-token-validator"+
      "?auth0_token="+encodeURIComponent(auth0Token || ""),
      {
        headers: {
          "X-api-key": "UhP5MWydh82ZXVeOXTyNaaHDtYkI7roD4D6Nd6Ud"
        }
      }
    ).then(response => {
      return response.json()
    }).then(json => {
      lambdaOutput.innerText = JSON.stringify(json, null, 4)
    })
  })

  tokenOutput.innerText = "--none--"
  lambdaOutput.innerText = "--none--"
});
