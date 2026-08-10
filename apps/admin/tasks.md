hello. i developed this project. it is monorepo project. it has some bugs and i  want to you, resolve them:

1. we have notificationdropdown in this path: C:\Users\ALIREZA\Desktop\filmam\apps\admin\src\utilities\components\notificationDropdown\notificationDropdown.tsx
in this component i show comments and contacts count. i want to be like this: on click on each item must redirect to that page. for example on click on comment item, must redirect to comments page, and like this for contact item.


2. in contact and comments page, we can change status of comment or contact.  after change  comment or contact status, we must invalidate this query key: queryKey: ['notification'], because it is show count of pending notification in header. and must update after update status of all comment or contact.

3. in comment and contact table we can select rows by multi select and can do action on selected rows. now we can just delete multiple rows. i want to add chnage status for multi select comments and contacts. for example if user select multi rows of commnets, user can approve or reject selected rows (and like this for contacts). add this option to multiselect actions of both comment and contacts and in backend apis instead of send one comment/contact id in param, we must send multi ids in body! like delete comment/contact. fix it on both contact and comments page. update backend too!

4. asyncselect component must has this option: if multiselect is false and user can just select one item, after select of one item, please close select drop down. but if was multiselect, must be still open!

5. in movie delete dialog confirm, movie title just must be between "". now is like this: "«test movie»"

6. when we want to create/edit one season, in dialog opened, in movie filed, must just show series type of movies. and must not show cinematic movies. because user just can create new season for series movies.

7. when i wanted to create new section, it send to me this error from backend {success: false, errors: [{status: 500,…}]}
errors
: 
[{status: 500,…}]
0
: 
{status: 500,…}
detail
: 
"\nInvalid `prisma.sectionTranslation.createMany()` invocation:\n\n{\n  data: [\n    {\n      language: undefined,\n      title: \"random section\",\n      description: \"random section description\",\n      section_id: 39\n    },\n    {\n      language: undefined,\n      title: \"سکشن رندوم\",\n      description: \"توضیحات سکشن رندوم\",\n      section_id: 39\n    },\n    {\n      language: undefined,\n      title: \"السکشن الرندوم\",\n      description: \"التوضیحات السکشن الرندوم\",\n      section_id: 39\n    }\n  ]\n}\n\nArgument `language` is missing."
status
: 
500
success
: 
false

but i send this body: {
    "slug": "random-section",
    "order": 9,
    "view_mode": "KIDS_SLIDER",
    "selection_mode": "MANUAL",
    "translations": [
        {
            "title": "random section",
            "description": "random section description",
            "language": "EN"
        },
        {
            "title": "سکشن رندوم",
            "description": "توضیحات سکشن رندوم",
            "language": "FA"
        },
        {
            "title": "السکشن الرندوم",
            "description": "التوضیحات السکشن الرندوم",
            "language": "AR"
        }
    ],
    "filters": [],
    "section_movies": [
        {
            "movie_id": 41,
            "view_mode": "SLIDER_ITEM",
            "order": 1,
            "entity_type": "MOVIE"
        },
        {
            "movie_id": 42,
            "view_mode": "SLIDER_ITEM",
            "order": 2,
            "entity_type": "MOVIE"
        },
        {
            "movie_id": 40,
            "view_mode": "SLIDER_ITEM",
            "order": 3,
            "entity_type": "MOVIE"
        }
    ]
}

fix it.


8. if i wanted to edit section, when edit dialog will open, it will send error and show 500 page!

9. in header menus page, when we will create new header menu, in dialog, after select filter menu type, the url field will be disable. i want to hide that when menu type is filter and just show when that was page!

10. in header menus page, when we will create new header menu, and when menu type is filter, in filter section next to filter value input, we have remove button but it is like hide and just have hover menu and can not see in normal state. please add x icon or any style to show that. and we have this problem for sections add/edit drawer. fix this error in both pages.

11. in roles page, in top of table we have view drop down. in that drop down, remove name and slug columns. because user can not show/hide that columns!

12. we have some apis for edit user by themself (like edit, change password, edit user data in /user put api). now in setting/profile or account page(which is good), please implement these feature, which user can see own info and can edit, chnage password must be in other form and seperate by put user api. and remove other dummy fields/forms/sections and not useable sections! if select each page, please remove other(if select account page please remove profile page and all files/components related to that and if selected profile page, do this for account page)

13. in apprance page, instead of chnage font of site, must chnage langiage of site. replace that.
14. remove notifications page.
15. in display page, replace all dummy sidebar data, with now actual sidebar items which user can select them!

16. in settings page please check all sections with my apis and remove all extra and not needable and not useable sections/pages/compoentns

17. please place notificationdropdown component in all of pages header and in order like dashboard page.

18. crawl in project and remove all extra and not needable and not useable sections/pages/compoentns/packages(like faker.js and all of that not used in project).

