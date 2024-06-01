//-- Project Code
import {getMessage} from '@glektarssza/webcraft-common';

if (document.readyState !== 'complete') {
    document.addEventListener('readystatechange', () => {
        if (document.readyState === 'complete') {
            const e = document.body.children[0];
            if (e !== undefined) {
                e.textContent = getMessage();
            }
        }
    });
} else {
    const e = document.body.children[0];
    if (e !== undefined) {
        e.textContent = getMessage();
    }
}
