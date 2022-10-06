const express = require('express');
const cors = require("cors")
const { buildSchema } = require('graphql');
const { graphqlHTTP } = require('express-graphql');
const path = require('path');
const mqtt = require('mqtt');

const MUSEUM_BROKER = `mqtt://localhost:1883`;

module.exports = () => {

    const mqttClient = mqtt.connect(MUSEUM_BROKER);
    const MQTTMessageStore = {};
    let currentUser = 'all';

    const schema = buildSchema(`
        type Query {
            getMQTTMessage(topic: String): String
            getCurrentUser: String
        }
        type Mutation {
            sendMQTTMessage(topic: String!, message: String!): Boolean
        }
    `)

    const root = {
        getMQTTMessage: ({ topic }) => {
            return MQTTMessageStore[topic];
        },
        getCurrentUser: () => {
            return currentUser;
        },
        sendMQTTMessage: ({ topic, message }) => {
            mqttClient.publish(topic, message);
            return true;
        }
    }

    const app = express(),
        port = 3001;

    const whitelist = ["http://localhost:3001", "http://localhost:3000"]
    const corsOptions = {
        origin: function (origin, callback) {
            if (!origin || whitelist.indexOf(origin) !== -1) {
                callback(null, true)
            } else {
                callback(new Error("Not allowed by CORS"))
            }
        },
        credentials: true,
    }

    app.use(cors(corsOptions))
    app.use(express.static(path.join(__dirname, '../interface/build')));
    app.use(express.json());
    app.use('/graphql', graphqlHTTP({
        schema: schema,
        rootValue: root,
        graphiql: true
    }));

    app.get(['index.html', '/'], (req, res) => {
        const auth = new Buffer.from(req.get('authorization').split(" ")[1], 'base64').toString();
        currentUser = auth.split(':')[0];
        res.sendFile(path.join(__dirname, '../dashboard/build/index.html'));
    });

    mqttClient.on('connect', () => {
        mqttClient.subscribe('#');
    })
    
    mqttClient.on('message', (topic, message) => {
        MQTTMessageStore[topic] = message.toString();
    });
    
    app.listen(port, () => {
        console.log(`listening on ${port}`);
    });
}