import React from 'react'
import { createRoot } from 'react-dom/client'
import { Auth0Provider } from '@auth0/auth0-react'
import App from './App'
import './styles.css'

const root = createRoot(document.getElementById('root'))

root.render(
  <Auth0Provider
    domain="dev-4zwtflcwcdswqbd2.us.auth0.com"
    clientId="cBEKMOSokgSyozPtD1UpOSzhf3t2ozoR"
    authorizationParams={{
      redirect_uri: window.location.origin
    }}
  >
    <App />
  </Auth0Provider>
)
