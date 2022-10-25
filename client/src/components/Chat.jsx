import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import io from 'socket.io-client';
import '../../public/css/components/chat.scss';
import Input from './Input';
import {
  useWriteMessageMutation,
  useDeleteMessageMutation,
} from '../../store/apis/accountApi';
import { useLazyGetMessagesQuery } from '../../store/apis/messageApi';

function Messages({ messages, currentLogin, type, chat }) {
  const [deleteMessage] = useDeleteMessageMutation();
  const { id } = useParams();

  async function onDeleteClick(e) {
    await deleteMessage({ id: e.target.id, type });
    chat.emit('delete', { id: e.target.id, room: id });
  }

  return messages.map((message) =>
    message.user.login === currentLogin ? (
      <div className="thisUserMessage" key={message.id}>
        <div className="message">
          <div className="text">{message.text}</div>
          <div className="lowestMessageBlock">
            <button
              type="button"
              className="deleteButton"
              onClick={onDeleteClick}
            >
              <span className="material-symbols-outlined" id={message.id}>
                delete
              </span>
            </button>
            <div className="date">{message.date}</div>
          </div>
        </div>
      </div>
    ) : (
      <div
        className="otherUserMessage"
        key={message.user.login + Math.random(Date.now())}
      >
        <div className="avatar">
          <img
            src={`${
              message.user.avatar ||
              'https://res.cloudinary.com/dbapiimages/image/upload/v1655238165/avatar-default_v7gfhw.svg'
            }`}
            alt="Фото користувача"
          />
        </div>
        <div className="message">
          <Link to={`/user/${message.user.login}`} className="name">
            {message.user.login}
          </Link>
          <div className="text">{message.text}</div>
          <div className="date">{message.date}</div>
        </div>
      </div>
    ),
  );
}

export default function Chat({ type }) {
  const chat = io.connect('http://localhost:4000');
  const inputMessageForm = useRef();
  const messageButton = useRef();
  const user = useSelector((state) => state.user);
  const { id } = useParams();
  const {
    register,
    trigger,
    formState: { errors },
  } = useForm();
  const [messages, setMessages] = useState([]);
  const [writeMessage] = useWriteMessageMutation();
  const [getMessages] = useLazyGetMessagesQuery();

  useEffect(() => {
    chat.emit('join', { room: id });

    chat.on('message', (result) => {
      if (result.user.login !== user.login) {
        setMessages((oldMessages) => [
          ...oldMessages,
          {
            id: result.id,
            user: result.user,
            text: result.text,
            type: result.type,
            room: result.room,
            date: result.date,
          },
        ]);
      }
    });

    chat.on('delete', ({ messageId }) => {
      setMessages((prevMessages) =>
        prevMessages.filter((value) => messageId !== value.id),
      );
    });

    getMessages({ type, id }).then((result) => {
      const receivedMessages = result.data.result.map((receivedMessage) => {
        const messageDatetime = receivedMessage.creation_time.split('.')[0];
        const messageDate = messageDatetime.split('T')[0];
        const messageTime = messageDatetime.split('T')[1];

        const messageDay =
          messageDate.split('-')[2].length === 1
            ? `0${messageDate.split('-')[2]}`
            : `${messageDate.split('-')[2]}`;
        const messageMonth =
          messageDate.split('-')[1].length === 1
            ? `0${messageDate.split('-')[1]}`
            : `${messageDate.split('-')[1]}`;
        const messageYear = messageDate.split('-')[0].slice(-2);

        const messageHour = messageTime.split(':')[0];
        const messageMinute = messageTime.split(':')[1];

        const updatedMessageDatetime = `${messageDay}.${messageMonth}.${messageYear} ${messageHour}:${messageMinute}`;

        const message = {
          id: receivedMessage.id,
          user: {
            login: receivedMessage.login,
            avatar: receivedMessage.avatar,
          },
          text: receivedMessage.message,
          date: updatedMessageDatetime,
        };

        return message;
      });
      setMessages(receivedMessages);
    });

    return () => chat.disconnect();
  }, []);

  useEffect(() => {
    inputMessageForm.current.message.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
      }
    });
  }, [inputMessageForm.current?.message, messageButton]);

  async function onMessageSubmit() {
    const inputMessageFormErrors = await trigger('message');
    if (!inputMessageFormErrors) {
      return false;
    }
    const result = await writeMessage({
      userLogin: user.login,
      text: inputMessageForm.current.message.value,
      type,
      room: id,
    });
    const message = {
      user,
      text: inputMessageForm.current.message.value,
      type,
      id: result.data.result.id,
      room: id,
      date: `${
        String(new Date().getDate()).length === 1
          ? `0${new Date().getDate()}`
          : `${new Date().getDate()}`
      }.${
        String(new Date().getMonth() + 1).length === 1
          ? `0${new Date().getMonth() + 1}`
          : `${new Date().getMonth() + 1}`
      }.${String(new Date().getFullYear()).slice(-2)} ${
        String(new Date().getHours()).length === 1
          ? `0${new Date().getHours()}`
          : `${new Date().getHours()}`
      }:${
        String(new Date().getMinutes()).length === 1
          ? `0${new Date().getMinutes()}`
          : `${new Date().getMinutes()}`
      }`,
    };
    setMessages((oldMessages) => [...oldMessages, message]);
    chat.emit('message', message);
    return true;
  }

  return (
    <div className="chatBlock">
      <div className="mainBlock">
        <div className="chat block">
          <h2 className="header">Чат</h2>
          <div className="chatMessages">
            <Messages
              messages={messages}
              currentLogin={user.login}
              type={type}
              chat={chat}
            />
          </div>
        </div>
        <div
          className="messageEnterBlock block"
          style={user.role !== 'user' ? { display: 'none' } : {}}
        >
          <form action="" method="POST" ref={inputMessageForm}>
            <Input
              type="text"
              label="Повідомлення"
              input={register('message', {
                required: 'Поле повинно бути заповнено',
                maxLength: {
                  value: 100,
                  message: 'Повинно бути не більше 100 символів',
                },
              })}
              errors={errors}
            />
          </form>
          <button type="button" onClick={onMessageSubmit} ref={messageButton}>
            Надіслати
          </button>
        </div>
      </div>
    </div>
  );
}
