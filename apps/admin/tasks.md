
12. all entities have sort dropdown top of table. ASC and DESC, it default to DESC but it does not send it to backend bydefault. just when it is ASC will send and backend default i think in ASC and we will get conflict. fix it in all entities. fix in front or baclend!

13. in movies table we dont need to genre column in table
14. in episode view drop down top of table, we must show/hide all columns except for title and slug. and fix this for section entity too.
15. in section page when edit drawer will be open we have error and wen to 500 page.

16. in comment page and comment approved and reject action, we must add this features to multiselect of table. for example, admin can select some comments and reject or approced that. like delet comments.
17. after reject/approved comment, it will not invalidated comments query (i think). if yes, fix it.
18. after chnage status of comments or contacts, we must invalidate summary for header notificationdropdown data.
19. in notification drop down we must after click on comment and contact item, must redirect to that page.

20. in comment table we can show hide every columns except for comment and user
21. like review item 20, for conatct we can show/hide every columns except for email and meesgae.

22. in roles page and roles table, type clumns must be between name and created at. and type columns can show and hide in view dropdown.
23. all search apis for all entities (for allll) must search for all labguages. like this if search field is name and name was ali, when user in english lang search ali or علی must find that. not just search for slected language. for example, this is not good: if panel lanugae is en and user typed علی and ali was not found! search in all languages in backend!

24. in contact page, in table when we open one row(for see rejected or approved detail), approved or rejected label badge will be under dialog close button icon.

25. (very important). i noticed and understood, in movies page and movies table when onclick on edit button and open edit drawer, we call two api for get movie detail (admin and public). please just call one api admin. and every thing you need is in public and is not in admin, implement in admin (update backend) and get data from just that admin movie detail api. just call one api!

26. in edit/add episode i have 400 error with this message: files.0.type should not be empty. i think it is for dto. fix it