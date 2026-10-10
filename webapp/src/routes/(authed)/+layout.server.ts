import { redirect } from '@sveltejs/kit';

export function load({ cookies, url}){
    if(!cookies.get('loggedIn')){
        redirect(302, `/login?redirectTo=${url.pathname}`);
    }
}