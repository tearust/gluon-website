tag=latest
echo building backend..
cd backend
echo building docker backend...
docker build . -t tearust/gluon-website-backend:$tag
cd ..
echo building frontend...
cd frontend
npm run build
echo building docker frontend...
docker build . -t tearust/gluon-website-frontend:$tag
cd ..
echo docker push

docker push tearust/gluon-website-frontend:$tag
docker push tearust/gluon-website-backend:$tag
