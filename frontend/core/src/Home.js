import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import logo from './assets/user/logo.png';  
import TerminalLogin from './users/TerminalLogin';
import LoginRegister from './users/LoginForm';
import HomeGame from './game/Home_game'
import './Home.css';
import Template from './instance/Template';  
import ModalInstance from './instance/ModalInstance';

function Home() {
    const [isModalTerminal, setIsModalTerminal] = useState(false);
    const [isModalForms, setIsModalForms] = useState(false);
    const [isModalGame, setIsModalGame] = useState(false);
    const [isLaunch, setIsLaunch] = useState([]);
    const setters = [
        {name: 'terminal', setter: setIsModalTerminal},
        {name: 'game', setter: setIsModalGame},
    ]
    const modalTerminalRef = useRef(null);
    const modalFormsRef = useRef(null);
    const modalGameRef = useRef(null);

    const removeLaunch = (appName) => {
        setIsLaunch((prevLaunch) => prevLaunch.filter((app) => app !== appName));
    };

    const handleModal = ({ setModal, boolean }) => setModal(boolean);

    const launching = ({ newLaunch, setModal }) => {
        setIsLaunch((prevLaunch) => [...prevLaunch, newLaunch]);
        handleModal({ setModal: setModal, boolean: true });
    };

    function isLaunched(launched, searchApp) {
        return launched.includes(searchApp);
    }

    return (
        <Template
            appArray={setters}
            launching={launching}
            taskBarContent={
                <div className="task-bar-content">
                    {isLaunched(isLaunch, "terminal") && (
                        <button
                            className={`${isModalTerminal ? "button-on" : "button-off"}`}
                            onClick={() => {
                                handleModal({ setModal: setIsModalTerminal, boolean: !isModalTerminal });
                            }}
                        >
                            Terminal
                        </button>
                    )}
                    {isLaunched(isLaunch, "forms") && (
                        <button
                            className={`${isModalForms ? "button-on" : "button-off"}`}
                            onClick={() => {
                                handleModal({ setModal: setIsModalForms, boolean: !isModalForms });
                            }}
                        >
                            Form
                        </button>
                    )}
                    {isLaunched(isLaunch, "game") && (
                        <button
                            className={`${isModalGame ? "button-on" : "button-off"}`}
                            onClick={() => {
                                handleModal({ setModal: setIsModalGame, boolean: !isModalGame });
                            }}
                        >
                            Game
                        </button>
                    )}
                </div>
            }
        >
            <button
                className="icon term"
                onClick={() => launching({ newLaunch: "terminal", setModal: setIsModalTerminal })}
            >
                Terminal
            </button>
            <button
                className="icon game"
                onClick={() => launching({ newLaunch: "game", setModal: setIsModalGame })}
            >
                Game
            </button>

            <ModalInstance
                isModal={isModalTerminal}
                modalRef={modalTerminalRef}
                name="Terminal"
                onLaunchUpdate={() => removeLaunch("terminal")}
                onClose={() => setIsModalTerminal(false)}
            >
                <TerminalLogin setModal={setIsModalForms} launching={launching} />
            </ModalInstance>

            <ModalInstance
                isModal={isModalForms}
                modalRef={modalFormsRef}
                name="Forms"
                onLaunchUpdate={() => removeLaunch("forms")}
                onClose={() => setIsModalForms(false)}
            >
                <LoginRegister />
            </ModalInstance>

            <ModalInstance
                isModal={isModalGame}
                modalRef={modalGameRef}
                name="Game"
                onLaunchUpdate={() => removeLaunch("game")}
                onClose={() => setIsModalGame(false)}
            >
                <HomeGame/>
            </ModalInstance>
        </Template>
    );
}

export default Home;
