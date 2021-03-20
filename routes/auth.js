const express = require('express');
const router = express.Router();
const msal = require('@azure/msal-node');
const REDIRECT_URI = "http://localhost:3000/redirect";

const fetch = require("node-fetch");

const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();

router.get('/calendars', (req, res) => {
    const token = "EwCAA8l6BAAU6k7+XVQzkGyMv7VHB/h4cHbJYRAAAbF1W+Ju8v9QDCpzCAJvF6cu3JLMQvGFybiQn3CLy/fOt2YB7iHZEjZXcYodZqVmx+OZeObTFAF9t8POeMmm1tPK5Bo9Dp4wjdmQJLK223Gm9uIJDxJqNUaOLHzX7Ow/mlVunN9R/dO/h5SGFRGokIVN6cJO+Ja6TmfvHKiOgiB/uJRG231NTiW+i4r6F7BWNFM6O+B/m1ggl/WlkFC/zrt4k6blSnBynArvMvg2RuANEdVsvtrsRnuEcqnMIZ73WyGJe/YQ/5xrkzfy4zZcqKDQHaL21TeFXuMQ/Uu3W8zs6RGLLAS0GHg9NFXizaFOk3xi9d08lS26TmS8FCjHAAYDZgAACK69m08nhh7GUAKcU78EiRhzmsG6+VfL6sy9CuRvB7arApiXUSDwRkulzqcZL8nJ1O1A6xk7+tkoeXGTOCa57ZEdzeeSPZMYISycT/h2UsldXi/DDAaEvmXkrnvI0mdTzOexFaZsOvgZmcrCVUG0IGT/Id4DDwUVXHtB8JZBNQXx+g/t7HBTRrGLI0aZz76uiiLvizGenBFsF9Z2jTkfE0ZFFQ7pWnlJnAErguiWCNHsRuNn0robLtsdeJU9AR9XUDvqODifbbbrRmaXlJbkwu4rgwmkhWJexCXyURTgOQ/GgPQGwcIpu4zRGzdXtHOoHYXc42lZESXQrrcL2hiQ/t6wjJ6158uEoGOl2S1i4OPVDc1GfhPaEN72dCNO/frqbZWowafqeWpHbPxqRi4LSeAWL47lUUunwWnEKOpmQxA7mitlZVoBx6l0Zquk6B0dsMOxBE64+LTgXins6cvYCHaCm09Y+lFwSrK0BzW4pXjJ2j3u8kMUpBH7FptMZLnQDKsjHWizPcFDDrvK2kt9sCz/5P+AuGkGrkEGyr/ahG1Su+ZHKupXOcDHv9QYLYHJDTsJ2BxVsmmMOro8+kUh0luh+2/cKW9VXeUzK5FzEKsB78DnkIat+xZqyta0WVEwB83XPNvQHvepzf0i6IIl1Qw76BMLbMqcqw1pEYHZPVenUJ0dkqJpsYaP8GgUUwanbOAzmkzvVhQ/SL9ynRLqIcn8yyTSbQBWCS+dy/bZXmWWuXzArCezDjlj39GA0G6Ccy0XxC+Iy9JDT8jJlseu6X/XCvZL/sWtfN90igI="
    const bearer = `Bearer ${token}`;

    const options = {
        method: "GET",
        headers: {
            "Authorization": bearer,
            "Prefer": "outlook.body-content-type"
        }
    };

    fetch("https://graph.microsoft.com/v1.0/me/calendars", options)
        .then(response => response.json())
        .then(response => {
            res.json(response);
        })
        .catch(error => console.log(error));
});

router.get('/rooms', (req, res) => {
    res.json({ name: 'rooms', rooms: [1, 2, 3] });
});

router.get('/user/calendars', (req, res) => {
    const token = req.query.token;
    const bearer = `Bearer ${token}`;

    const options = {
        method: "GET",
        headers: {
            "Authorization": bearer,
            "Prefer": "outlook.body-content-type"
        }
    };

    fetch("https://graph.microsoft.com/v1.0/me/calendars", options)
        .then(response => response.json())
        .then(response => {
            res.json(response);
        })
        .catch(error => console.log(error));
});

router.get('/user/token/refresh', (req, res) => {
    const token = req.query.token;

    let details = {
        client_id: "a9846d23-3cda-4679-9ae1-5c47918faf6c",
        scope: 'calendars.readwrite.shared',
        refresh_token: token,
        redirect_uri: 'https://holden-d9487.firebaseapp.com/__/auth/handler',
        grant_type: 'REFRESH_TOKEN',
        client_secret: "-1Ye1PGyi.BpjFxOgg7V8X~q7IE~RNhtn0",
    };

    let formBody = [];
    for (let property in details) {
        let encodedKey = encodeURIComponent(property);
        let encodedValue = encodeURIComponent(details[property]);
        formBody.push(encodedKey + "=" + encodedValue);
    }

    formBody = formBody.join("&");

    console.log('formBody: ', formBody)

    const options = {
        method: "POST",
        headers: {
            "Content-Type": 'application/x-www-form-urlencoded',

        },
        body: formBody
    };

    fetch("https://login.microsoftonline.com/common/oauth2/v2.0/token", options)
        .then(response => response.json())
        .then(response => {
            res.json(response);
        })
        .catch(error => console.log(error));
});

module.exports = router;