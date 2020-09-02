# Build container
sudo docker build -t socket-hub-prod backend

# Run container
sudo docker run --rm -it \
	--name socket-hub-prod \
	-p 3000:3000 \
	socket-hub-prod