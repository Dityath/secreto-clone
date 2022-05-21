import axios from "axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Head from "next/head";
import Image from "next/image";
import { useState, useEffect } from "react";

const Home = () => {
  const [message, setMessage] = useState("");
  const [title, setTitle] = useState("");
  const [maxMessage, setMaxMessage] = useState(false);
  const [maxTitle, setMaxTitle] = useState(false);
  const [errMsg, setErrMsg] = useState(false);
  const [errTitle, setErrTitle] = useState(false);

  const [data, setData] = useState(null);

  dayjs.extend(relativeTime);

  useEffect(() => {
    message.length >= 488 ? setMaxMessage(true) : setMaxMessage(false);
    title.length >= 70 ? setMaxTitle(true) : setMaxTitle(false);
    axios
      .get("https://secreto-clone-app.herokuapp.com/message")
      .then((resp) => {
        setData(resp.data);
        console.log(resp.data);
      })
      .catch((err) => {});
  }, [message, title]);

  return (
    <>
      <Head>
        <title>Secret Message</title>
        <meta name="description" content="Send Dityath a secret message" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="bg-slate-900 text-slate-200 w-full min-h-screen flex justify-center px-20">
        <div className="w-full h-full max-w-3xl flex flex-col items-center gap-4 pt-10 pb-20">
          <h1 className="text-4xl font-semibold">Send me a secret message</h1>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (title && message) {
                axios
                  .post("https://secreto-clone-app.herokuapp.com/message", {
                    title: title,
                    message: message,
                  })
                  .then((resp) => {
                    setTitle("");
                    setMessage("");
                  })
                  .catch((err) => console.log(err));
              }
              if (!title) {
                setErrTitle(true);
              }
              if (!message) {
                setErrMsg(true);
              }
            }}
            className="w-full flex flex-col items-center gap-3"
          >
            <div className="w-full">
              <input
                type="text"
                placeholder="Message title"
                className={`w-full input ${
                  maxTitle ? "input-warning" : errTitle ? "input-error" : ""
                }`}
                maxLength={70}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setErrTitle(false);
                }}
                value={title}
              />
              <label className="label">
                <span className="label-text-alt">
                  {maxTitle ? (
                    <>Sorry, only 70 characters!</>
                  ) : errTitle ? (
                    <>Please input text</>
                  ) : (
                    ""
                  )}
                </span>
                <span className="label-text-alt"></span>
              </label>
            </div>
            <div className="w-full">
              <textarea
                className={`textarea w-full ${
                  maxMessage
                    ? "textarea-warning"
                    : errMsg
                    ? "textarea-error"
                    : ""
                }`}
                placeholder="Your message"
                maxLength={488}
                onChange={(e) => {
                  setMessage(e.target.value);
                  setErrMsg(false);
                }}
                value={message}
              ></textarea>
              <label className="label">
                <span className="label-text-alt">
                  {maxMessage ? (
                    <>You&#39;re in max limit!!</>
                  ) : errMsg ? (
                    <>Please input message</>
                  ) : (
                    ""
                  )}
                </span>
                <span className="label-text-alt">
                  {message.length}/488 Characters
                </span>
              </label>
            </div>
            <div className="w-full">
              <button type="submit" className="btn">
                Submit
              </button>
            </div>
          </form>
          <div className="divider" />
          <div className="w-full flex flex-col gap-10">
            {data
              ?.slice(0)
              .reverse()
              .map((dataMsg) => (
                <div
                  key={dataMsg.id}
                  className="card w-full bg-base-100 shadow-xl"
                >
                  <div className="card-body">
                    <h2 className="card-title">{dataMsg.title}</h2>
                    <p>{dataMsg.message}</p>
                    <span className="badge">
                      {dayjs(dataMsg.created_at).fromNow()}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
