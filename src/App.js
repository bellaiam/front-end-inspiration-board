import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BoardList from "./components/BoardList";
import CardList from "./components/CardList";
import NewBoardForm from './components/NewBoard';
import NewCardForm from './components/NewCard';
import './App.css';

function App() {
  const [boards, setBoards] = useState([]);
  const [currentBoard, setCurrentBoard] = useState(null);
  const [cards, setCards] = useState([]);
  const [isBoardSelected, setIsBoardSelected] = useState(false);
  const [sortValue, setSortValue] = useState("");

  const API = "http://127.0.0.1:5000"; // local backend

  // Fetch boards and optionally cards
  const getData = async (param = "") => {
    try {
      const boardRes = await axios.get(`${API}/boards`);
      setBoards(boardRes.data);

      // Select first board if none is selected
      let selectedBoard = currentBoard;
      if (!currentBoard && boardRes.data.length > 0) {
        selectedBoard = boardRes.data[0];
        setCurrentBoard(selectedBoard);
        setIsBoardSelected(true);
      }

      if (selectedBoard) {
        const cardsRes = await axios.get(`${API}/boards/${selectedBoard.board_id}/cards${param}`);
        setCards(cardsRes.data.cards);
      } else {
        setCards([]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // Run once on mount
  useEffect(() => {
    getData();
  }, []);

  // POST new board
  const postBoard = async (newBoardData) => {
    try {
      await axios.post(`${API}/boards`, newBoardData);
      getData();
    } catch (err) {
      console.log(err);
    }
  };

  // POST new card
  const postCard = async (newCardData) => {
    if (!currentBoard) return;
    try {
      await axios.post(`${API}/boards/${currentBoard.board_id}/cards`, newCardData);
      getData();
    } catch (err) {
      console.log(err);
    }
  };

  const changeBoard = async (id) => {
    const board = boards.find((b) => b.board_id === id);
    if (!board) return;

    setCurrentBoard(board);
    setIsBoardSelected(true);

    try {
      const res = await axios.get(`${API}/boards/${id}/cards`);
      setCards(res.data.cards);
      setSortValue("");
    } catch (err) {
      console.log(err);
    }
  };

  const deleteBoard = async (id) => {
    try {
      await axios.delete(`${API}/boards/${id}`);
      setBoards(boards.filter(b => b.board_id !== id));
      setCurrentBoard(null);
      setIsBoardSelected(false);
      setCards([]);
    } catch (err) {
      console.log(err);
    }
  };

  const increaseLikes = async (id) => {
    const card = cards.find(c => c.card_id === id);
    if (!card) return;

    const updatedCard = { ...card, likes_count: card.likes_count + 1 };
    setCards(cards.map(c => c.card_id === id ? updatedCard : c));

    try {
      await axios.patch(`${API}/cards/${id}/likes_count`, { likes_count: updatedCard.likes_count });
      getData();
    } catch (err) {
      console.log(err);
    }
  };

  const deleteCard = async (id) => {
    try {
      await axios.delete(`${API}/cards/${id}`);
      getData();
    } catch (err) {
      console.log(err);
    }
  };

  const changeSort = (sort_by) => {
    setSortValue(sort_by);
    getData(sort_by);
  };

  return (
    <div className="page">
      <div className="content">
        <header className="App-header">
          <h1>INSPIRATION BOARD</h1>
        </header>

        <section className="board-view">
          <div>
            <h2>BOARDS</h2>
            <BoardList boards={boards} changeBoard={changeBoard} />
          </div>

          {currentBoard && (
            <div>
              <h2>SELECTED BOARD</h2>
              <p>{currentBoard.title} - {currentBoard.owner}</p>
              <button onClick={() => deleteBoard(currentBoard.board_id)}>Delete board</button>
            </div>
          )}

          <div>
            <h2>CREATE A NEW BOARD</h2>
            <NewBoardForm addBoard={postBoard} />
          </div>
        </section>

        <section className="card-view">
          {isBoardSelected && (
            <>
              <h2>CARDS FOR {currentBoard.title.toUpperCase()}</h2>
              <select className="drop-down" onChange={e => changeSort(e.target.value)}>
                <option value="?sort=by_id">Sort by id</option>
                <option value="?sort=alpha">Sort alphabetically</option>
                <option value="?sort=likes">Sort by likes</option>
              </select>
              <CardList cards={cards} increaseLikes={increaseLikes} deleteCard={deleteCard} />
              <h2>CREATE A NEW CARD</h2>
              <NewCardForm addCard={postCard} />
            </>
          )}
        </section>
      </div>
    </div>
  );
}

export default App;