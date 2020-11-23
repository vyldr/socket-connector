# This program will connect to the server using websockets
# to send and recieve messages.

import asyncio
import websockets
import json
import sys
from aioconsole import ainput  # Async input

# Setup
server = 'ws://localhost:3000/ws'
channel_key = ''  # Your key here

# Make sure key was added
if channel_key == '':
    print('Error: No key provided')
    exit()


async def receive(ws):
    # Listen for messages from the server and display them
    while True:
        # Get the message
        jsonInput = await ws.recv()
        message = json.loads(jsonInput)

        # Display received messages and reset prompt
        print('\r', message)
        print('\rType a message: ', end='')


async def send(ws):
    # Input a message to send
    while True:
        message = await ainput('\rType a message: ')
        await ws.send(message)


async def main(server, channel_key):
    # Connect to the server
    print('Connecting to', server)
    async with websockets.connect(server) as ws:

        # Authenticate
        await ws.send(channel_key)

        # Communicate with the server
        await asyncio.gather(receive(ws), send(ws))

asyncio.run(main(server, channel_key))
