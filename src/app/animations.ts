import { trigger, transition, animate, style, query, group, animateChild } from '@angular/animations';

const resetRoute = [
    style({ position: 'relative' }),
    query(
        ':enter, :leave',
        [
            style({
                position: 'absolute', // using absolute makes the scroll get stuck in the previous page's scroll position on the new page
                top: 0, // adjust if you have a header so it factors in the height and not cause the router outlet to jump as it animates
                left: 0,
                width: '100%',
                opacity: 0,
            }),
        ],
        { optional: true }
    ),
];

export const fadeInAnimation =
    trigger('fadeInAnimation', [
        transition('* => HomePage, * => TaskManagerPage, * => UserEditPage, * => TasksPage', [
            ...resetRoute,
            query(':leave', animateChild(), { optional: true }),
            query(':enter', [style({ opacity: 0 })], {
                optional: true,
            }),
            query(':leave', animateChild(), { optional: true }),
            group([
                query(
                    ':leave',
                    [style({ opacity: 1 }), animate('0.2s', style({ opacity: 0 }))],
                    { optional: true }
                ),
                query(
                    ':enter',
                    [style({ opacity: 0 }), animate('0.5s', style({ opacity: 1 }))],
                    { optional: true }
                ),
            ]),
            query(':enter', animateChild(), { optional: true })
        ]),
    ]);
