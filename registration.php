<?php
$recepient = "zavada.dmitry@gmail.com";
$sitename = "Well Wheel";

$phone = trim($_POST["phone"]);
$name = trim($_POST["name"]);
$data_form = trim($_POST["data_form"]);

$feedback = trim($_POST["feedback"]);
$type = trim($_POST["data_type"]);
$value = trim($_POST["data_value"]);

$location = trim($_POST["location"]);
$date_submitted = trim($_POST['Y-m-d']);
$time_submitted = trim($_POST["H:i"]);
$ref = trim($_POST["ref"]);
$utm_source = trim($_POST["utm_source"]);
$utm_campaign = trim($_POST["utm_campaign"]);
$utm_medium = trim($_POST["utm_medium"]);
$utm_term = trim($_POST["utm_term"]);
$utm_content = trim($_POST["utm_content"]);
$time_submitted = trim($_POST["time_submitted"]);
$ip_address = $_SERVER["REMOTE_ADDR"];
$page_url = trim($_POST["page_url"]);

$arrayMessage = array(
    array(
        'message' => "👤 Имя: ",
        'field' => $name
    ),
    array(
        'message' => '☎ Телефон: ',
        'field' => $phone
    ),

    array(
        'message' => 'Отзыв: ',
        'field' => $feedback
    ),

    array(
        'message' => 'Тип: ',
        'field' => $type
    ),

    array(
        'message' => 'Условия:: ',
        'field' => $value
    ),

    array(
        'message' => '📝 Отправленная форма: ',
        'field' => $data_form
    ),

    array(
        'message' => 'Пришел со страницы: ',
        'field' => $ref
    ),
    array(
        'message' => 'Отправленно со страницы: ',
        'field' => $location
    ),
    array(
        'message' => 'utm_source: ',
        'field' => $utm_source
    ),
    array(
        'message' => 'utm_campaign: ',
        'field' => $utm_campaign
    ),
    array(
        'message' => 'utm_medium: ',
        'field' => $utm_medium
    ),
    array(
        'message' => 'utm_term: ',
        'field' =>  $utm_term
    ),
    array(
        'message' => 'utm_content: ',
        'field' => $utm_content
    ),
);

function reduceMessage($arr, $prefix)
{
    $message = '';
    foreach ($arr as $obj) {
        if ($obj['field']) {
            $message .= $obj['message'] . $obj['field'] . $prefix;
        }
    }
    return $message;
}

$pagetitle = "Заявка на storehouse ";
$messageTB = "‼ $pagetitle ‼\n" . reduceMessage($arrayMessage, "\n");

// $messageTB = "
// ‼ $pagetitle ‼
// 👤 Имя: $name
// ☎ Телефон: $phone
// 🏘 Город: $city
// Стеллажи: $product1
// Лестницы/тележки: $product2
// Покраска: $product3
// Котлы: $product4
// Резка: $product5
// Другое: $product6

// 📝 Отправленная форма: $data_form
// 🔗 page_url: $page_url
// 📅 date_submitted: $date_submitted
// ⏲ time_submitted: $time_submitted

// lead_name: $lead_name
// lead_price: $lead_price
// ref: $ref
// utm_source: $utm_source
// utm_campaign: $utm_campaign
// utm_medium: $utm_medium
// utm_term: $utm_term
// utm_content: $utm_content
// ";


//SEND MESSAGE TO TELEGRAM
function sendMessage($chatID, $message, $token)
{
    $url = "https://api.telegram.org/" . $token . "/sendMessage?chat_id=" . $chatID;
    $url = $url . "&text=" . urlencode($message);
    $ch = curl_init();
    $optArray = array(CURLOPT_URL => $url, CURLOPT_RETURNTRANSFER => true);
    curl_setopt_array($ch, $optArray);
    $result = curl_exec($ch);
    curl_close($ch);
}

$token = "bot1350366433:AAFtUXdY52ZBiebxRBA4dESEv9R6xsHHbu4";
$chatID = "-418046552";

sendMessage($chatID, $messageTB, $token);

$messageEmail = reduceMessage($arrayMessage, "<br>");

// Для отправки HTML-письма должен быть установлен заголовок Content-type
$headers  = 'MIME-Version: 1.0' . "\r\n";
$headers .= 'Content-type: text/html; charset=urf-8' . "\r\n";

// Дополнительные заголовки
$headers .= 'From: storehouse';

mail($recepient, $pagetitle, $messageEmail, $headers);
