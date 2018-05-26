const socket = io('http://localhost:3000', {
    path: '/slam/add'
});

socket.on('reload', (data) => {
    location.reload();
})