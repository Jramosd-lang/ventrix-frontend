import * as signalR from "@microsoft/signalr";

export let connection = null;

export async function iniciarConexion() {
    if (!connection) {
        connection = new signalR.HubConnectionBuilder()
            .withUrl("https://localhost:7012/pedidosHub", {
                withCredentials: true,
            })
            .configureLogging(signalR.LogLevel.Information)
            .build();
    }

    if (connection.state === signalR.HubConnectionState.Disconnected) {
        await connection.start();
    }

    // Do not register global handlers here. The app should register handlers where needed
    // to avoid duplicate listeners across components.

    return connection;
}
