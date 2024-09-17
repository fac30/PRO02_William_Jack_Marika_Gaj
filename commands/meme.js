async function getMeme() {
  const res = await fetch("https://memeapi.pythonanywhere.com/");
  return res.data.memes[0].url;
}

export default getMeme;
