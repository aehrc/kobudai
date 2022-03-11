create table if not exists imported_code (id bigint generated by default as identity, code varchar(50), display varchar(512), _index bigint not null, imported_codeset_id bigint not null, primary key (id));
create table if not exists imported_codeset (id bigint generated by default as identity, created timestamp, created_by varchar(255), modified timestamp, modified_by varchar(255), name varchar(100), version varchar(30), primary key (id));
create table if not exists map (id bigint generated by default as identity, created timestamp, created_by varchar(255), modified timestamp, modified_by varchar(255), map_version varchar(30), to_scope varchar(1024) not null, to_version varchar(60), project_id bigint not null, source_id bigint not null, primary key (id));
create table if not exists map_row (id bigint generated by default as identity, created timestamp, created_by varchar(255), modified timestamp, modified_by varchar(255), no_map boolean not null, status integer not null, author_task_id bigint, "last_author_id" varchar(255), "last_reviewer_id" varchar(255), map_id bigint not null, review_task_id bigint, source_code_id bigint not null, primary key (id));
create table if not exists map_row_target (id bigint generated by default as identity, created timestamp, created_by varchar(255), modified timestamp, modified_by varchar(255), flagged boolean not null, relationship integer not null, target_code varchar(18), target_display varchar(2048), row_id bigint not null, primary key (id));
create table if not exists note (id bigint generated by default as identity, created timestamp, created_by varchar(255), modified timestamp, modified_by varchar(255), note_text varchar(256) not null, maprow_id bigint not null, "note_by_id" varchar(255) not null, primary key (id));
create table if not exists project (id bigint generated by default as identity, created timestamp, created_by varchar(255), modified timestamp, modified_by varchar(255), description varchar(200), title varchar(100), primary key (id));
create table if not exists project_guests (project_id bigint not null, guests_id varchar(255) not null, primary key (project_id, guests_id));
create table if not exists project_members (project_id bigint not null, members_id varchar(255) not null, primary key (project_id, members_id));
create table if not exists project_owners (project_id bigint not null, owners_id varchar(255) not null, primary key (project_id, owners_id));
create table if not exists task (id bigint generated by default as identity, created timestamp, created_by varchar(255), modified timestamp, modified_by varchar(255), description varchar(60), type integer not null, "assignee_id" varchar(255), map_id bigint not null, primary key (id));
create table if not exists "user" (id varchar(255) not null, created timestamp, created_by varchar(255), modified timestamp, modified_by varchar(255), email varchar(255), family_name varchar(100), given_name varchar(100), nickname varchar(100), primary key (id));
alter table imported_code add constraint if not exists UK2kj7s8wg0qgrisyvkf6rtdpf3 unique (_index, imported_codeset_id);
alter table imported_code add constraint if not exists UK2rnm9qqto6h88nqeoas3so3g unique (code, imported_codeset_id);
alter table map_row add constraint if not exists UniqueMapAndSourceCode unique (map_id, source_code_id);
alter table imported_code add constraint if not exists FKbmqbof5iexq8mo6p6vw1uh5e7 foreign key (imported_codeset_id) references imported_codeset;
alter table map add constraint if not exists FK5a8ljc6xrj8w0xmlyr92mrw2t foreign key (project_id) references project;
alter table map add constraint if not exists FK9jdh2jk489y0b49o4k35ld4ch foreign key (source_id) references imported_codeset;
alter table map_row add constraint if not exists FK5sq41qusaerjw4l4gm9tudrkq foreign key (author_task_id) references task;
alter table map_row add constraint if not exists FKsufg1nb3gqe6k06sarrwdjiht foreign key ("last_author_id") references "user";
alter table map_row add constraint if not exists FKas95ff8edlb36ql1ko1rertgp foreign key ("last_reviewer_id") references "user";
alter table map_row add constraint if not exists FK93uu5g46v77a1uah6ck1enwwl foreign key (map_id) references map;
alter table map_row add constraint if not exists FKs7lcvu6u8r0w2hap6ve299iag foreign key (review_task_id) references task;
alter table map_row add constraint if not exists FK9hqcobqlpiqo60q1mg1ywhgra foreign key (source_code_id) references imported_code;
alter table map_row_target add constraint if not exists FK97xhy765d746ecdgtgy7ccki4 foreign key (row_id) references map_row;
alter table note add constraint if not exists FK4c6i16l2wjnbd4wf7cea5jh2u foreign key (maprow_id) references map_row;
alter table note add constraint if not exists FKs7yw5sgwd20bsdl2shhq21u1d foreign key ("note_by_id") references "user";
alter table project_guests add constraint if not exists FK72xypqt6fthn93fr2grn2ncre foreign key (guests_id) references "user";
alter table project_guests add constraint if not exists FK7bemis13nkyirufjjuw017pfh foreign key (project_id) references project;
alter table project_members add constraint if not exists FKsgthbwe2h7rtyme5msv3rvyi6 foreign key (members_id) references "user";
alter table project_members add constraint if not exists FKi28gx2d4xrrhtrfnk12aef1e4 foreign key (project_id) references project;
alter table project_owners add constraint if not exists FK9nbt24endqpu1ximibb1mcwag foreign key (owners_id) references "user";
alter table project_owners add constraint if not exists FKexkqjlfmh77jqhim0i33su5pl foreign key (project_id) references project;
alter table task add constraint if not exists FKlb5j5ow1845t8jxg555ums4th foreign key ("assignee_id") references "user";
alter table task add constraint if not exists FKd6jex3bd7gmx27d5efexbyf8m foreign key (map_id) references map;
