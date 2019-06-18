<?php

use Game\Game;

require dirname(__DIR__) . '/vendor/autoload.php';
Ratchet\Server\IoServer::factory(new Ratchet\Http\HttpServer(new Ratchet\WebSocket\WsServer(new Game())), 4000)->run();