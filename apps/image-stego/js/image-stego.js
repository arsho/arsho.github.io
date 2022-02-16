/**
 * Copyright (c) 2022
 *
 * @summary Image steganography JS script with encryption and decryption
 * @author Ahmedur Rahman Shovon <shovon.sylhet@gmail.com>
 *
 */

let my_image = new Image();
let stego_canvas = document.getElementById("stego_canvas");
let preview_card = document.getElementById("preview_card");
preview_card.style.display = 'none';
let my_ctx = stego_canvas.getContext("2d");
let w, h;


function encrypt_msg() {
    let encrypt_footer_text = "ImageStego does not store anything. Store the secret key and encrypted image in a secure location.";
    document.getElementById("operation_body_span").style.display = 'block';
    document.getElementById("plain_text_msg_span").innerHTML =
        "Message to Encrypt";
    document.getElementById("save").innerHTML = "Encrypt Image";
    document.getElementById("show_mode_info").innerHTML =
        "Running on Encryption Mode";
    document.getElementById("plain_text_msg").value = '';
    document.getElementById("plain_text_msg_span").style.display = 'block';
    document.getElementById("plain_text_msg").style.display = 'block';
    document.getElementById("form-footer-text").innerText = encrypt_footer_text;
}

function decrypt_msg() {
    let decrypt_footer_text = "If you forgot the key which was used to encrypt, you cannot decrypt the image. ImageStego neither stores the encrypted image nor the key which you have used to encrypt the image.";
    document.getElementById("operation_body_span").style.display = 'block';
    document.getElementById("plain_text_msg_span").innerHTML =
        "Decrypted message";
    document.getElementById("save").innerHTML = "Decrypt Image";
    document.getElementById("show_mode_info").innerHTML =
        "Running on Decryption Mode";
    document.getElementById("plain_text_msg_span").style.display = 'none';
    document.getElementById("plain_text_msg").style.display = 'none';
    document.getElementById("form-footer-text").innerText = decrypt_footer_text;
}

function my_bin(passed_int) {
    let bin_str = '';
    while (passed_int > 0) {
        if (passed_int % 2 === 1)
            bin_str = '1' + bin_str;
        else
            bin_str = '0' + bin_str;
        passed_int = Math.floor(passed_int / 2);
    }
    return bin_str;
}

function convert_ascii_to_bin9(current_char_ascii) {
    let current_char_ascii_bin = my_bin(current_char_ascii);
    let current_char_ascii_bin_str = current_char_ascii_bin.toString();

    let current_char_ascii_bin_str_len = current_char_ascii_bin_str.length;

    let zero_prefix = '';
    for (let i = 0; i < 9 - current_char_ascii_bin_str_len; i++)
        zero_prefix = zero_prefix + '0';

    current_char_ascii_bin_str = zero_prefix + current_char_ascii_bin_str;
    return current_char_ascii_bin_str;
}

function convert_str_to_bin9_str(bin_str) {
    let zero_prefix = '';
    let bin_str_len = bin_str.length;
    for (let i = 0; i < 9 - bin_str_len; i++)
        zero_prefix = zero_prefix + '0';
    bin_str = zero_prefix + bin_str;
    return bin_str;
}

function convert_int_to_bin27(passed_int) {
    let passed_bin = my_bin(passed_int);
    let passed_bin_str = (passed_bin).toString();
    let passed_bin_str_len = (passed_bin_str).length;
    let zero_prefix = '';
    for (let i = 0; i < 27 - passed_bin_str_len; i++)
        zero_prefix = zero_prefix + '0';

    passed_bin_str = zero_prefix + passed_bin_str;
    return passed_bin_str;
}

// encode starts
function convert_to_bin_str(msg_str) {
    let final_msg = '';
    let msg_str_len = (msg_str).length;
    let current_char;
    let current_char_ascii;
    let current_char_ascii_str;
    for (let i = 0; i < msg_str_len; i++) {
        current_char = msg_str.charAt(i);
        current_char_ascii = current_char.charCodeAt(0);
        current_char_ascii_str = convert_ascii_to_bin9(current_char_ascii);
        final_msg = final_msg + current_char_ascii_str;
    }

    let final_msg_len = (final_msg).length;
    let msg_info_str = convert_int_to_bin27(final_msg_len);
    final_msg = msg_info_str + final_msg;
    return final_msg;
}


function attach_single_char_to_pixel(color_pixel, char_bin_str) {
    let add_ar = [];
    let temp_str;
    for (let i = 0; i < char_bin_str.length; i = i + 3) {
        temp_str = char_bin_str.charAt(i) + char_bin_str.charAt(i + 1) +
            char_bin_str.charAt(i + 2);
        add_ar.push(temp_str);
    }
    let ret_pixel_ar = [];

    let current_val_bin;
    let current_val_bin_9;
    for (let i = 0; i < color_pixel.length; i++) {
        current_val_bin = my_bin(color_pixel[i]);
        current_val_bin_9 = convert_str_to_bin9_str(current_val_bin);
        temp_str = current_val_bin_9.slice(0, 6) + add_ar[i];
        ret_pixel_ar.push(temp_str);
    }

    let ret_final_pixel_ar = [];
    let temp_int;
    for (let i = 0; i < ret_pixel_ar.length; i++) {
        temp_int = parseInt(ret_pixel_ar[i], 2);
        ret_final_pixel_ar.push(temp_int);
    }
    return ret_final_pixel_ar;
}


function create_stego(msg_str, message_key) {
    msg_str = message_key + String.fromCharCode(127) + msg_str;
    let msg_str_binary = convert_to_bin_str(msg_str);
    let msg_str_binary_len = (msg_str_binary).length;
    let start_pos = 0;
    let my_data = my_ctx.getImageData(0, 0, w, h);
    let len = my_data.data.length / 4;
    let r, g, b, temp;
    for (let i = 0; i < len; i++) {
        r = my_data.data[i * 4];
        g = my_data.data[i * 4 + 1];
        b = my_data.data[i * 4 + 2];
        temp = [r, g, b];

        if ((start_pos + 9) <= msg_str_binary_len) {
            temp = attach_single_char_to_pixel(temp, msg_str_binary.slice(start_pos, start_pos + 9))
            start_pos = start_pos + 9;
        }

        my_data.data[i * 4] = temp[0];
        my_data.data[i * 4 + 1] = temp[1];
        my_data.data[i * 4 + 2] = temp[2];
    }
    my_ctx.putImageData(my_data, 0, 0);
}

//encode ends

//decode starts

function get_single_char_from_pixel(color_pixel_ar) {
    let ret_char_bin_str = '';
    let current_val_bin;
    let current_val_bin_9;
    let temp_str;
    for (let i = 0; i < color_pixel_ar.length; i++) {
        current_val_bin = my_bin(color_pixel_ar[i]);
        current_val_bin_9 = convert_str_to_bin9_str(current_val_bin);
        temp_str = current_val_bin_9.slice(6, 9);
        ret_char_bin_str = ret_char_bin_str + temp_str;
    }
    let ret_char_ascii = parseInt(ret_char_bin_str, 2);
    return (String.fromCharCode(ret_char_ascii));
}


function get_binary_str_from_pixel(color_pixel_ar) {
    let ret_char_bin_str = '';
    let current_val_bin;
    let current_val_bin_9;
    let temp_str;
    for (let i = 0; i < color_pixel_ar.length; i++) {
        current_val_bin = my_bin(color_pixel_ar[i]);
        current_val_bin_9 = convert_str_to_bin9_str(current_val_bin);
        temp_str = current_val_bin_9.slice(6, 9);
        ret_char_bin_str = ret_char_bin_str + temp_str;
    }
    return ret_char_bin_str;
}

function decode_msg_from_stego() {

    let pixel_ar = [];

    let my_data = my_ctx.getImageData(0, 0, w, h);
    let len = my_data.data.length / 4;
    let r, g, b, temp;
    for (i = 0; i < len; i++) {
        r = my_data.data[i * 4];
        g = my_data.data[i * 4 + 1];
        b = my_data.data[i * 4 + 2];
        temp = [r, g, b];
        pixel_ar.push(temp);
    }


    let msg_str_total_bit_str = '';
    for (let i = 0; i < 3; i++)
        msg_str_total_bit_str += get_binary_str_from_pixel(pixel_ar[i]);

    let msg_str_total_bit_int = parseInt(msg_str_total_bit_str, 2);
    let msg_str_total_pixel = Math.floor(msg_str_total_bit_int / 9);

    let decrypted_msg = '';
    let current_char;
    for (let i = 3; i < msg_str_total_pixel + 3; i++) {
        current_char = get_single_char_from_pixel(pixel_ar[i]);
        decrypted_msg = decrypted_msg + current_char;
    }
    let separator = String.fromCharCode(127);
    let index = decrypted_msg.indexOf(separator);
    let key = decrypted_msg.substr(0, index);
    decrypted_msg = decrypted_msg.substr(index + 1);
    return [key, decrypted_msg];
}

//decode ends

function canvas_init() {
    let get_w;
    let get_h;
    let rat;

    get_w = my_image.width;
    get_h = my_image.height;
    if (get_w > 800) {
        my_ctx.scale(.1, .1);
        rat = get_w / get_h;
        get_w = 800.0;
        get_h = get_w / rat;
    }
    stego_canvas.height = get_h;
    stego_canvas.width = get_w;
    my_ctx.drawImage(my_image, 0, 0, get_w, get_h);
    w = get_w;
    h = get_h;
    my_ctx.shadowBlur = 0;
    my_ctx.textAlign = "center";
    stego_canvas.style.display = "block";
}

function preview_file() {
    preview_card.style.display = 'block';
    let file = document.getElementById("user_image").files[0];
    let reader = new FileReader();

    reader.addEventListener("load", function () {
        // convert image file to base64 string
        my_image.src = reader.result;
    }, false);

    my_image.onload = function () {
        canvas_init();
    };

    if (file) {
        reader.readAsDataURL(file);
    }
}


function encrypt_msg_function(message_key) {
    let msg_str = document.getElementById("plain_text_msg").value;
    create_stego(msg_str, message_key);
}

function do_encrypt_or_decrypt() {
    canvas_init();
    let select_operation = document.getElementById("save").innerText.trim();
    let message_key = document.getElementById("message_key").value;
    let decoded_msg, decoded_key, decoded_array;
    if (select_operation === "Encrypt Image") {
        encrypt_msg_function(message_key);
        save_encrypted_image();
    } else {
        decoded_array = decode_msg_from_stego();
        decoded_key = decoded_array[0];
        decoded_msg = decoded_array[1];
        if (decoded_key === message_key) {
            document.getElementById("plain_text_msg_span").style.display = 'block';
            document.getElementById("plain_text_msg").style.display = 'block';
            document.getElementById("plain_text_msg").value = decoded_msg;
        } else {
            alert("Your key does not match with the key which is used in encryption");
        }
    }
}

function save_encrypted_image() {
    let image_data = stego_canvas.toDataURL();
    let temporary_link = document.createElement('a');
    temporary_link.download = 'stego_' + Date.now() + '.png';
    temporary_link.href = image_data;
    document.body.appendChild(temporary_link);
    temporary_link.click();
    document.body.removeChild(temporary_link);
}