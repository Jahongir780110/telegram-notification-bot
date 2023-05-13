const messages = fetch("http://localhost:3000/messages").then((data) => {
  console.log(data);
});
