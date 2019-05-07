<?php
$phone = htmlspecialchars($_POST["phone"]);
$form = htmlspecialchars($_POST["form"]);

if (!empty($phone)) {

	// $to = 'spbremcentre@gmail.com, khripunovpp@gmail.com, texremitservice@gmail.com, tehnopcru@mail.ru, khripunovpp@mail.ru';
	$to = 'khripunovpp@gmail.com';
	$subject = 'Profi Master (Москва)';
	$headers  = 'MIME-Version: 1.0' . "\r\n";
	$headers .= 'Content-type: text/html; utf-8' . "\r\n";
	$headers .= 'From: Profi Master <info@profimaster.pro>' . "\r\n";
	$message = "<table>";
	$message .= "<tr><td><b>Контактный телефон</b></td><td>$phone</td></tr>";
	$message .= "<tr><td colspan=\"2\">Сообщение создано автоматически!</td></tr>";
	$message .= "</table>";
				
	mail($to, $subject, $message, $headers);

	$jsonout = '{"form": "'.$form.'", "status": "success"}';

} else {

	$jsonout = '{"form": "'.$form.'", "status": "error"}';
	
}

echo $jsonout;

?>