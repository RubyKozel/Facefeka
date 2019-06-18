<?php
/**
 * Created by IntelliJ IDEA.
 * User: kozel
 * Date: 12/06/2019
 * Time: 12:13
 */

namespace Game;

use Ratchet\ConnectionInterface;
use Ratchet\MessageComponentInterface;

class Game implements MessageComponentInterface
{
    protected $roomId;
    protected $rooms;
    protected $players;
    protected $canvasHeight;
    protected $connections;
    protected $names;

    public function __construct()
    {
        $this->connections = new \SplObjectStorage;
        $this->rooms = array();
        $this->players = array();
        $this->roomId = 0;
        $this->canvasHeight = 120;
        $this->names = array();
    }

    /**
     * When a new connection is opened it will be passed to this method
     * @param  ConnectionInterface $conn The socket/connection that just connected to your application
     * @throws \Exception
     */
    function onOpen(ConnectionInterface $conn)
    {
        $this->connections->attach($conn);
        $this->players[$conn->resourceId] = array('y' => 60);
        $conn->send(json_encode(array('type' => 'players', 'value' => $this->players)));
    }

    /**
     * This is called before or after a socket is closed (depends on how it's closed).  SendMessage to $conn will not result in an error if it has already been closed.
     * @param  ConnectionInterface $conn The socket/connection that is closing/closed
     * @throws \Exception
     */
    function onClose(ConnectionInterface $conn)
    {
        echo "disconnected\n";
        $this->connections->detach($conn);
        unset($this->players[$conn->resourceId]);
        foreach ($this->rooms as $topic) {
            if (isset($topic[$conn->resourceId])) {
                echo "unsubscribed " . $topic['number'] . " \n";
                $this->onMessage($conn, json_encode(array('type' => 'unsubscribe', 'number' => $topic['number'])));
                break;
            }
        }
    }

    /**
     * If there is an error with one of the sockets, or somewhere in the application where an Exception is thrown,
     * the Exception is sent back down the stack, handled by the Server and bubbled back up the application through this method
     * @param  ConnectionInterface $conn
     * @param  \Exception $e
     * @throws \Exception
     */
    function onError(ConnectionInterface $conn, \Exception $e)
    {
        echo 'Error was made, closing connection \n';
        echo $e . '\n';
        $conn->close();
    }

    /**
     * Triggered when a client sends data through the socket
     * @param  \Ratchet\ConnectionInterface $from The socket/connection that sent the message to your application
     * @param  string $msg The message received
     * @throws \Exception
     */
    function onMessage(ConnectionInterface $from, $msg)
    {
        $json = json_decode($msg);
        switch ($json->type) {
            case 'name':
                $this->names[$json->element] = $json->value;
                print_r($this->names);
                foreach ($this->connections as $conn) {
                    $conn->send(json_encode(array('type' => 'name', 'value' => $this->names)));
                }
                break;
            case 'createRoom':
                $this->createRoom();
                break;
            case 'subscribe':
                $this->subscribe($from, $json->value);
                break;
            case 'unsubscribe':
                $this->unsubscribe($from, $json);
                break;
            case 'start':
                unset($this->names);
                foreach ($this->connections as $conn) {
                    $conn->send(json_encode(array('type' => 'start')));
                }
                break;
            case 'status':
                $number = $json->number;
                $index = $json->index;
                $currY = $this->players[$from->resourceId]['y'];
                if ($json->keyUp && $currY > 0) {
                    $this->players[$from->resourceId] = array('y' => $currY - 200 * $json->deltaTime);
                } else if ($json->keyDown && $currY < $this->canvasHeight) {
                    $this->players[$from->resourceId] = array('y' => $currY + 200 * $json->deltaTime);
                }
                $this->rooms[$number]['players'][$index] = $this->players[$from->resourceId];
                $res = $this->checkCollision($number);
                if ($res != null) { //means game over
                    foreach ($this->connections as $conn) {
                        $conn->send(json_encode(array('type' => 'game over', 'value' => $res)));
                    }
                    break;
                }

                $moveX = $this->rooms[$number]['ball']['moveX'];
                $moveY = $this->rooms[$number]['ball']['moveY'];
                $this->rooms[$number]['ball']['ballX'] += $moveX * $json->deltaTime;
                $this->rooms[$number]['ball']['ballY'] += $moveY * $json->deltaTime;
                $ballX = $this->rooms[$number]['ball']['ballX'];
                $ballY = $this->rooms[$number]['ball']['ballY'];
                foreach ($this->connections as $conn) {
                    $conn->send(json_encode(array('type' => 'players', 'value' => $this->players)));
                    $conn->send(json_encode(array('type' => 'ball', 'value' => array('ballX' => $ballX, 'ballY' => $ballY))));
                }
                break;

        }

    }

    function createRoom()
    {
        echo "Room " . $this->roomId . " was created \n";
        $this->rooms[$this->roomId] =
            array(
                'number' => $this->roomId,
                'ball' =>
                    array(
                        'ballX' => 150,
                        'ballY' => 75,
                        'moveX' => -20,
                        'moveY' => 20,
                        'startX' => 75,
                        'startY' => 150,
                        'radius' => 2
                    ),
                'players' => array()
            );
        $this->roomId++;
    }

    function subscribe(ConnectionInterface $from, $index)
    {
        echo "Subscribing\n";
        $room = $this->rooms[$this->roomId - 1];
        if (isset($room)) {
            $this->rooms[$this->roomId - 1]['players'][$index] = $this->players[$from->resourceId];
            $from->send(json_encode(array('type' => 'subscribe', 'value' => $this->roomId - 1)));
        } else {
            $from->send(json_encode(array('error' => 'Room wasn\'t found')));
        }
        echo "Joined room " . ($this->roomId - 1) . "\n";
    }

    function unsubscribe(ConnectionInterface $from, $json)
    {
        $room = $this->rooms[$json->number];
        if (isset($room)) {
            unset($room);
            $from->send(json_encode(array('type' => 'unsubscribe')));
        } else {
            $from->send('Room wasn\'t found');
        }
    }

    function checkCollision($number)
    {
        $player0 = $this->rooms[$number]['players'][0];
        $player1 = $this->rooms[$number]['players'][1];
        $ball = $this->rooms[$number]['ball'];
        $ballX = $ball['ballX'];
        $ballY = $ball['ballY'];
        $radius = $ball['radius'];

        if ($ballX + $radius <= 5 && $ballY + $radius <= $player0['y'] + 30 && $ballY + $radius >= $player0['y']) { // collide player0
            $this->rooms[$number]['ball']['moveX'] *= -1;
            return null;
        } else if ($ballX + $radius >= 295 && $ballY + $radius <= $player1['y'] + 30 && $ballY + $radius >= $player1['y']) { // collide player1
            $this->rooms[$number]['ball']['moveX'] *= -1;
            return null;
        } else if ($ballY + $radius <= 0 && $ballX + $radius >= 5 && $ballX + $radius <= 295) { // top
            $this->rooms[$number]['ball']['moveY'] *= -1;
            return null;
        } else if ($ballY + $radius >= 150 && $ballX + $radius >= 5 && $ballX + $radius <= 295) { // bottom
            $this->rooms[$number]['ball']['moveY'] *= -1;
            return null;
        } else if ($ballX + $radius < 5 && ($ballY + $radius > $player0['y'] + 30 || $ballY + $radius < $player0['y'])) { // player1 won
            return '1';
        } else if ($ballX + $radius > 295 && ($ballY + $radius > $player1['y'] + 30 || $ballY + $radius < $player1['y'])) { // player0 won
            return '0';
        } else {
            return null;
        }
    }
}