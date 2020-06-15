
module.exports = (redis, clientConfig) => {
    const CHANNEL_NAME = 'channel';
    const publisher = redis.createClient(clientConfig); //издатель
    const subscriber = redis.createClient(clientConfig); //подписчик

    //подписка на события
    subscriber.on('unsubscribe', channel => console.log(`Client has been unsubscribed from the '${channel}' channel`));
    subscriber.on('subscribe', channel => console.log(`Client has been subscribed to the '${channel}' channel`));
    subscriber.on('message', (channel, message) => console.log(`Client has received a message: ${message}. From ${channel}`));

    subscriber.subscribe(CHANNEL_NAME); //подписались на канал CHANNEL_NAME

    let sendMessageInterval = setInterval(() => {
        publisher.publish(CHANNEL_NAME, 'The message for the channel'); //публикуем сообщения каждую секунду, и мы это  видим
    }, 1000);

    //через 5 секунд мы отпишемся от канала, и сообщения мы соответственно не увидим
    setTimeout(() => {
        subscriber.unsubscribe(CHANNEL_NAME); //отпииска
        clearInterval(sendMessageInterval);
        publisher.quit();
        subscriber.quit();
    }, 5000);
};
