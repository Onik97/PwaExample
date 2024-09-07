FROM node:20.11.0 AS frontend-build

WORKDIR /app
COPY . .

WORKDIR /app/pwaexample.client

ARG VITE_DISCORD_CLIENT_ID
ARG VITE_DISCORD_CALLBACK
ARG VITE_PUBLIC_API_URL

ENV VITE_DISCORD_CLIENT_ID=$VITE_DISCORD_CLIENT_ID
ENV VITE_DISCORD_CALLBACK=$VITE_DISCORD_CALLBACK
ENV VITE_PUBLIC_API_URL=$VITE_PUBLIC_API_URL

RUN npm install
RUN npm run build

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS backend-build
EXPOSE 8080

RUN apt-get update && apt-get install -y default-mysql-client

WORKDIR /app
COPY --from=frontend-build /app /app

WORKDIR /app/PwaExample.Server
RUN dotnet publish ./PwaExample.Server.csproj -c Release -o ./publish /p:UseAppHost=false

WORKDIR /app/PwaExample.Server/publish
ENTRYPOINT ["dotnet", "PwaExample.Server.dll"]
