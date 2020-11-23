# Socket Connector

## What is this?

Socket Connector is a communication service that connects multiple WebSocket clients to each other.  It allows you to create channels that WebSocket clients can connect to.  Any message sent to a channel will then be sent to all other connected WebSocket clients on that same channel.

## How to use it

After signing in, you will see the channel management page where you can add and remove channels.  After adding a new channel, you can copy its key to connect from your own WebSocket client.  Just have your client connect to socketconnector.com/ws and send the channel key as the first message.  You will then be able to send and receive messages from your channel.

## Example

Here is a Python example that shows how to use the service.  You must add your own channel key to test it.  The program will display any messages it receives as well as allow you to type and send messages.

## Control page

The control button on each channel will take you to the control page.  This page lets you manually send inputs to your channel.  The supported input types are typed messages, keypresses, mouse input, and game controller input.  This page also displays any messages to or from the channel.