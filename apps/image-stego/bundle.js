let my_image=new Image,stego_canvas=document.getElementById("stego_canvas"),preview_card=document.getElementById("preview_card"),my_ctx=(preview_card.style.display="none",stego_canvas.getContext("2d")),w,h;function encrypt_msg(){document.getElementById("operation_body_span").style.display="block",document.getElementById("plain_text_msg_span").innerHTML="Message to Encrypt",document.getElementById("save").innerHTML="Encrypt Image",document.getElementById("show_mode_info").innerHTML="Running on Encryption Mode",document.getElementById("plain_text_msg").value="",document.getElementById("plain_text_msg_span").style.display="block",document.getElementById("plain_text_msg").style.display="block",document.getElementById("form-footer-text").innerText="ImageStego does not store anything. Store the secret key and encrypted image in a secure location."}function decrypt_msg(){document.getElementById("operation_body_span").style.display="block",document.getElementById("plain_text_msg_span").innerHTML="Decrypted message",document.getElementById("save").innerHTML="Decrypt Image",document.getElementById("show_mode_info").innerHTML="Running on Decryption Mode",document.getElementById("plain_text_msg_span").style.display="none",document.getElementById("plain_text_msg").style.display="none",document.getElementById("form-footer-text").innerText="If you forgot the key which was used to encrypt, you cannot decrypt the image. ImageStego neither stores the encrypted image nor the key which you have used to encrypt the image."}function my_bin(e){let t="";for(;0<e;)t=e%2==1?"1"+t:"0"+t,e=Math.floor(e/2);return t}function convert_ascii_to_bin9(e){let t=my_bin(e);var e=t.toString(),n=e.length;let o="";for(let e=0;e<9-n;e++)o+="0";return o+e}function convert_str_to_bin9_str(e){let t="";var n=e.length;for(let e=0;e<9-n;e++)t+="0";return e=t+e}function convert_int_to_bin27(e){let t=my_bin(e);var e=t.toString(),n=e.length;let o="";for(let e=0;e<27-n;e++)o+="0";return o+e}function convert_to_bin_str(t){let n="";var o,a=t.length;let r;for(let e=0;e<a;e++)o=convert_ascii_to_bin9((r=t.charAt(e)).charCodeAt(0)),n+=o;var e=convert_int_to_bin27(n.length);return n=e+n}function attach_single_char_to_pixel(t,n){let o=[],a;for(let e=0;e<n.length;e+=3)a=n.charAt(e)+n.charAt(e+1)+n.charAt(e+2),o.push(a);let r=[];var i,l;let _;for(let e=0;e<t.length;e++)i=my_bin(t[e]),_=convert_str_to_bin9_str(i),a=_.slice(0,6)+o[e],r.push(a);let c=[];for(let e=0;e<r.length;e++)l=parseInt(r[e],2),c.push(l);return c}function create_stego(e,t){let n=convert_to_bin_str(e=t+String.fromCharCode(127)+e);var o=n.length;let a=0,r=my_ctx.getImageData(0,0,w,h);var s=r.data.length/4;let i,l,_,c;for(let e=0;e<s;e++)i=r.data[4*e],l=r.data[4*e+1],_=r.data[4*e+2],c=[i,l,_],a+9<=o&&(c=attach_single_char_to_pixel(c,n.slice(a,a+9)),a+=9),r.data[4*e]=c[0],r.data[4*e+1]=c[1],r.data[4*e+2]=c[2];my_ctx.putImageData(r,0,0)}function get_single_char_from_pixel(t){let n="";var o;let a;for(let e=0;e<t.length;e++)o=my_bin(t[e]),o=(a=convert_str_to_bin9_str(o)).slice(6,9),n+=o;var e=parseInt(n,2);return String.fromCharCode(e)}function get_binary_str_from_pixel(t){let n="";var o;let a;for(let e=0;e<t.length;e++)o=my_bin(t[e]),o=(a=convert_str_to_bin9_str(o)).slice(6,9),n+=o;return n}function decode_msg_from_stego(){let t=[];var e,n,o,a=my_ctx.getImageData(0,0,w,h),r=a.data.length/4;for(i=0;i<r;i++)e=a.data[4*i],n=a.data[4*i+1],o=a.data[4*i+2],t.push([e,n,o]);let l="";for(let e=0;e<3;e++)l+=get_binary_str_from_pixel(t[e]);var _,c=parseInt(l,2),m=Math.floor(c/9);let s="";for(let e=3;e<m+3;e++)_=get_single_char_from_pixel(t[e]),s+=_;c=String.fromCharCode(127),c=s.indexOf(c);return[s.substr(0,c),s=s.substr(c+1)]}function canvas_init(){let e,t;var n;e=my_image.width,t=my_image.height,800<e&&(my_ctx.scale(.1,.1),n=e/t,e=800,t=e/n),stego_canvas.height=t,stego_canvas.width=e,my_ctx.drawImage(my_image,0,0,e,t),w=e,h=t,my_ctx.shadowBlur=0,my_ctx.textAlign="center",stego_canvas.style.display="block"}function preview_file(){preview_card.style.display="block";var e=document.getElementById("user_image").files[0];let t=new FileReader;t.addEventListener("load",function(){my_image.src=t.result},!1),my_image.onload=function(){canvas_init()},e&&t.readAsDataURL(e)}function encrypt_msg_function(e){create_stego(document.getElementById("plain_text_msg").value,e)}function do_encrypt_or_decrypt(){canvas_init();var e,t=document.getElementById("save").innerText.trim(),n=document.getElementById("message_key").value;"Encrypt Image"===t?(encrypt_msg_function(n),save_encrypted_image()):(e=(t=decode_msg_from_stego())[0],t=t[1],e===n?(document.getElementById("plain_text_msg_span").style.display="block",document.getElementById("plain_text_msg").style.display="block",document.getElementById("plain_text_msg").value=t):alert("Your key does not match with the key which is used in encryption"))}function save_encrypted_image(){var e=stego_canvas.toDataURL();let t=document.createElement("a");t.download="stego_"+Date.now()+".png",t.href=e,document.body.appendChild(t),t.click(),document.body.removeChild(t)}