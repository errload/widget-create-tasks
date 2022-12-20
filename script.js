// create tasks
define(['jquery', 'underscore', 'twigjs'], function ($, _, Twig) {
    var CustomWidget = function () {
        var self = this,
            system = self.system(),
            langs = self.langs;

        var checkboxes = {}, // объект настроек виджета
            task_ID = 0, // ID задачи
            blockControls = null, // блок настроек виджета
            checkbox = null, // чекбокс в настройках виджета
            min_length = null; // минимальное количество символов создания задачи

        // функция обновления настроек виджета
        this.setSettings = function (checkboxes) {
            $(`#${ self.get_settings().widget_code }_custom`).val(JSON.stringify(checkboxes));
            $(`#${ self.get_settings().widget_code }_custom`).trigger('change');
        }

        // функция получения настроек виджета
        this.getSettings = function () {
            checkboxes = self.get_settings().checkboxes || {};
            if (typeof checkboxes !== 'string') checkboxes = JSON.stringify(checkboxes);
            checkboxes = JSON.parse(checkboxes);
            return checkboxes;
        }

        // функция преобразования длины символов в число, иначе 0
        this.minLengthToInt = function () {
            self.set_settings({ min_length: parseInt(self.get_settings().min_length) });
            if (!Number.isInteger(self.get_settings().min_length)) self.set_settings({ min_length: 0 });
            min_length = self.get_settings().min_length;
        }

        // функция добавления чекбокс с настройками
        this.сheckboxSettings = function () {
            blockControls = $('.widget_settings_block .widget_settings_block__controls');

            // получаем настройки виджета
            checkboxes = self.getSettings();

            // чекбокс
            checkbox = self.render(
                {ref: '/tmpl/controls/checkbox.twig'},
                {
                    input_class_name: 'create_task_checkbox',
                    name: 'create-task-checkbox',
                    id: null,
                    value: 'Обязательность выполнения задачи',
                    text: 'Обязательность выполнения задачи'
                }
            );

            // добавляем чекбокс в настройки
            blockControls.before(`
                <div class="widget_settings_block__item_field checkbox_wrapper" style="margin-top: 5px;">
                    <div class="widget_settings_block__input_field">
                        ${ checkbox }
                    </div>
                </div>
            `);
            checkbox = $('.widget_settings_block .checkbox_wrapper .control-checkbox');

            // нажатие на чекбокс
            checkbox.unbind('change');
            checkbox.bind('change', function () {
                // если чекбокс нажат, показываем текущие настройки
                if (checkbox.hasClass('is-checked')) {






                    // обновляем настройки виджета
                    checkboxes.isChecked = true;
                    self.setSettings(checkboxes);

                    // показываем ссылку участников
                    $('.widget_settings_block .checkbox_wrapper').after(`
                        <div class="widget_settings_block__item_field subscribers__wrapper">
                            <div class="widget_settings_block__input_field" style="width: 100%;">
                                <div class="subscribers" style="position: relative;">
                                    <a href="" class="js-subscribe link__users" style="font-size: 16px; color: #4c8bf7;">
                                        Участники:
                                        <span id="show-chat-list-length" class="js-counter">
                                            0
                                        </span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    `);

                    $('.widget_settings_block .checkbox_wrapper .js-counter').text(
                        checkboxes.managers ? checkboxes.managers.length : 0
                    );

                    // нажатие на ссылку с участниками
                    $('.widget_settings_block .subscribers__wrapper .link__users').unbind('click');
                    $('.widget_settings_block .subscribers__wrapper .link__users').bind('click', function (e) {
                        e.preventDefault();

                        // wrapper, кнопки и поиск
                        $('.widget_settings_block .subscribers__wrapper .subscribers').append(`
                            <div class="subscribers-container js-container subscribers-container--full" 
                                style="display: block; width: 250px;">
                                
                                <div class="js-view-container" style="background: #ffffff;">
                                    <div class="subscribers-full">
                                        <div class="js-users-picker users-picker">
                                        
                                            <div>
                                                <div class="
                                                    users-picker-controls js-users-picker-controls 
                                                    users-picker-controls--disabled
                                                    " style="background: #fff;">
                                                    
                                                    <button class="
                                                        users-picker-controls__cancel js-users-picker-controls-cancel 
                                                        " style="cursor: pointer;">
                                                        Отменить
                                                    </button>
                                                    <button class="
                                                        users-picker-controls__save js-users-picker-controls-save 
                                                        " style="cursor: pointer;">
                                                        Сохранить
                                                    </button>
                                                </div>

                                                <div class="users-picker-search" style="background: #ffffff;">
                                                    <span class="users-picker-search__icon">
                                                        <svg class="svg-icon svg-common--filter-search-dims">
                                                            <use xlink:href="#common--filter-search"></use>
                                                        </svg>
                                                    </span>
                                                    <input class="users-picker-search__field js-multisuggest-input" 
                                                        style="width: 5px;">
                                                    <tester style="
                                                        position: absolute; top: -9999px; left: -9999px; width: auto; 
                                                        font-size: 14px; font-family: PT Sans, Arial, sans-serif; 
                                                        font-weight: 400; font-style: normal; letter-spacing: 0px; 
                                                        text-transform: none; white-space: pre;">
                                                    </tester>
                                                </div>
                                            </div>
                                            
                                            <div class="js-multisuggest-suggest" data-multisuggest-id 
                                                style="display: block;">
                                            </div>

                                            <div class="js-multisuggest-list" data-is-suggest="y" 
                                                data-multisuggest-id style="display: block;">
                                                
                                                <div class="multisuggest__suggest js-multisuggest-suggest custom-scroll" 
                                                    style="max-height: 270px;">
                                                    <div class="users-select-row"></div>
                                                </div>
                                            </div>
                                            
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `);
                    });







                }
                // иначе удаляем формы
                else {
                    // пользователи
                    if ($('.widget_settings_block .subscribers__wrapper').length) {
                        $('.widget_settings_block .subscribers__wrapper').remove();
                    }

                    // воронки и статусы
                    if ($('.widget_settings_block .pipelines__wrapper').length) {
                        $('.widget_settings_block .pipelines__wrapper').remove();
                    }

                    // обновляем настройки виджета
                    checkboxes.isChecked = false;
                    self.setSettings(checkboxes);
                }
            });
        }






        // // вывод пользователей и статусов в настройки
        // this.lastSettings = function (checkboxes) {

        //
        //     // отображаем форму с пользователями
        //     $('a.linkUsers').unbind('click');
        //     $('a.linkUsers').bind('click', function (e) {
        //         e.preventDefault();
        //

        //
        //         // пользователи и группы
        //         var groups = AMOCRM.constant('groups'),
        //             managers = AMOCRM.constant('managers');
        //
        //         // перебираем группы и пользователей этих групп
        //         $.each(groups, function (key, value) {
        //             var users = [], groupID = key;
        //
        //             $.each(managers, function () {
        //                 if (this.group != key) return;
        //                 if (!this.active) return;
        //                 users.push({ id: this.id, title: this.title });
        //             });
        //
        //             // добавляем группу, если в ней есть пользователи
        //             if (!users.length) return;
        //             $('.multisuggest__suggest').append(`
        //                 <div class="users-select-row__inner group-color-wrapper">
        //                     <div class="users-picker-item users-picker-item--group  users-select__head group-color multisuggest__suggest-item"
        //                         data-title="${ value }" data-group="y" data-id="${ groupID }">
        //                         <div class="users-picker-item__title users-select__head-title">
        //                             <span>${ value }</span>
        //                         </div>
        //                         <div class="users-picker-item__pin">
        //                             <svg class="svg-icon svg-cards--pin-dims">
        //                                 <use xlink:href="#cards--pin"></use>
        //                             </svg>
        //                         </div>
        //                     </div>
        //                     <div class="users-select__body" data-id="${ groupID }"></div>
        //                 </div>
        //             `);
        //
        //             // добавляем пользователей к группе
        //             $.each(users, function () {
        //                 $(`.users-select__body[data-id="${ groupID }"]`).append(`
        //                     <div class="users-picker-item users-select__body__item"
        //                         id="select_users__user-${ this.id }" data-group="${ groupID }" data-id="${ this.id }">
        //                         <div class="users-picker-item__title multisuggest__suggest-item js-multisuggest-item true">
        //                             ${ this.title }
        //                         </div>
        //                         <div class="users-picker-item__pin users-picker-select">
        //                             <svg class="svg-icon svg-cards--pin-dims">
        //                                 <use xlink:href="#cards--pin"></use>
        //                             </svg>
        //                         </div>
        //                     </div>
        //                 `);
        //             });
        //         });
        //
        //         // search
        //         $('.users-picker-search__field').bind('input', function () {
        //             var searchVal = $(this).val().toLowerCase();
        //
        //             // перебираем пользователей на совпадения
        //             $.each($('.users-picker-item__title'), function () {
        //                 var itemText = $(this).text().toLowerCase();
        //
        //                 // если есть, остальных скрываем
        //                 if (!itemText.includes(searchVal)) {
        //                     if ($(this).parent().hasClass('users-picker-item--group')) return;
        //                     $(this).parent().addClass('hidden');
        //                 } else $(this).parent().removeClass('hidden');
        //             });
        //
        //             // если в группе пользователей не осталось, прячем группу
        //             $.each($('.users-select-row__inner'), function () {
        //                 var items = $(this).find('.users-select__body__item'),
        //                     counter = 0;
        //
        //                 $.each(items, function () {
        //                     if ($(this).hasClass('hidden')) return;
        //                     counter++;
        //                 });
        //
        //                 if (counter > 0) $(this).removeClass('hidden');
        //                 else $(this).addClass('hidden');
        //             });
        //         });
        //
        //         // отмечаем выбранных ранее пользователей
        //         $.each($('.users-select__body__item'), function () {
        //             var itemID = $(this).attr('data-id');
        //             if (!checkboxes.managers || !checkboxes.managers.includes(itemID)) return;
        //             if ($(this).hasClass('users-picker-item--selected')) return;;
        //             $(this).addClass('users-picker-item--selected');
        //         });
        //
        //         // выбор пользователя
        //         $('.users-select__body__item').unbind('click');
        //         $('.users-select__body__item').bind('click', function (e) {
        //             e.stopPropagation();
        //             var userID = $(e.target).closest('.users-select__body__item').attr('data-id');
        //             $(e.target).closest('.users-select__body__item').toggleClass('users-picker-item--selected');
        //             $('.users-picker-controls').removeClass('users-picker-controls--disabled');
        //         });
        //
        //         // выбор группы пользователей
        //         $('.users-picker-item--group').unbind('click');
        //         $('.users-picker-item--group').bind('click', function (e) {
        //             e.stopPropagation();
        //             var groupID = $(e.target).closest('.users-picker-item--group').attr('data-id');
        //
        //             $(e.target).closest('.users-picker-item--group').toggleClass('users-picker-item--selected');
        //             groupItems = $(`.users-select__body[data-id="${ groupID }"]`).find('.users-select__body__item');
        //             $('.users-picker-controls').removeClass('users-picker-controls--disabled');
        //
        //             if ($(`.users-picker-item--group[data-id="${ groupID }"]`).hasClass('users-picker-item--selected')) {
        //                 $.each(groupItems, function () {
        //                     if ($(this).hasClass('users-picker-item--selected')) return;
        //                     $(this).addClass('users-picker-item--selected');
        //                 });
        //             } else {
        //                 $.each(groupItems, function () {
        //                     if (!$(this).hasClass('users-picker-item--selected')) return;
        //                     $(this).removeClass('users-picker-item--selected');
        //                 });
        //             }
        //         });
        //
        //         // выравниваем пользователей относительно ссылки
        //         $('.js-view-container').css('border', '1px solid #c3c3c3');
        //         $('.subscribers-container').css({
        //             'left': '0',
        //             'top': '0',
        //             'border': '0'
        //         });
        //
        //         // прячем список пользователей
        //         $('.widget-settings').unbind('click');
        //         $('.widget-settings').bind('click', function (e) {
        //             // если это не ссылка, не счетчик и не сама форма, удаляем форму
        //             if ($(e.target).closest('.subscribers-container').length) return;
        //             if ($(e.target).hasClass('linkUsers')) return;
        //             if ($(e.target).parent().hasClass('linkUsers')) return;
        //             $('.subscribers-container').remove();
        //         });
        //
        //         // события кнопок отменить и сохранить
        //         $('.js-users-picker-controls-cancel').bind('click', () => { $('.subscribers-container').remove() });
        //         $('.users-picker-controls__save').bind('click', function () {
        //             var items = $('.users-select__body__item'),
        //                 managers = [];
        //
        //             $.each(items, function () {
        //                 if (!$(this).hasClass('users-picker-item--selected')) return;
        //                 managers.push($(this).attr('data-id'));
        //             });
        //
        //             checkboxes.managers = managers;
        //             self.saveSettings(checkboxes);
        //             $('.subscribers-container').remove();
        //             $('.subscribers .js-counter').text(managers.length);
        //         });
        //
        //     });
        //
        //     // воронки и статусы
        //     $.ajax({
        //         url: '/api/v4/leads/pipelines',
        //         success: function (data) {
        //             var pipelines = [];
        //
        //             $.each(data._embedded.pipelines, function () {
        //                 var pipeline_ID = this.id,
        //                     pipeline_name = this.name;
        //
        //                 // добавляем воронки
        //                 pipelines.push({ id: pipeline_ID, name: pipeline_name, statuses: [] });
        //
        //                 $.each(this._embedded.statuses, function () {
        //                     if (this.type == 1) return;
        //
        //                     var status_ID = this.id,
        //                         status_name = this.name,
        //                         status_color = this.color;
        //
        //                     // добавляем к воронкам статусы
        //                     $.each(pipelines, function () {
        //                         if (this.id !== pipeline_ID) return;
        //                         this.statuses.push({
        //                             id: status_ID,
        //                             name: status_name,
        //                             color: status_color
        //                         });
        //                     });
        //                 });
        //             });
        //
        //             // pipelines select
        //             var pipeline = Twig({ ref: '/tmpl/controls/pipeline_select/index.twig' }).render({
        //                     has_pipelines: true,
        //                     items: pipelines,
        //                     multiple: true,
        //                     class_name: 'modal__pipelines-settings',
        //                     id: 'pipelinesSettings'
        //                 }),
        //                 pipelinesWrapper = `
        //                     <div class="widget_settings_block__item_field pipelines__wrapper">
        //                         <div class="widget_settings_block__input_field" style="width: 100%;">
        //                             <div class="modal__pipelines__wrapper">
        //                                 <span style="width: 100%;">Воронки, этапы:</span>
        //                             </div>
        //                         </div>
        //                     </div>`;
        //
        //             $('.subscribers__wrapper').after(pipelinesWrapper);
        //             $('.pipelines__wrapper').append(pipeline);
        //             $('.pipelines__wrapper').css('margin-top', '3px');
        //
        //             $('.pipeline-select').unbind('click');
        //             $('.pipeline-select').bind('click', function () { $('.subscribers-container').remove() });
        //
        //             // отображаем ранее выбранные статусы
        //             if (checkboxes.statuses && checkboxes.statuses.length > 0) {
        //                 $.each(checkboxes.statuses, function (key, val) {
        //                     val = val.split('_');
        //                     var statusItem = $(`input[data-value="${val[2]}"]`);
        //                     if (!$(statusItem).closest('label').hasClass('is-checked')) {
        //                         $(statusItem).closest('label').addClass('is-checked');
        //                         $(statusItem).closest('label').trigger('click');
        //                     }
        //                 });
        //             }
        //
        //             // сохраняем выбранные статусы
        //             $('.pipeline-select').unbind('change');
        //             $('.pipeline-select').bind('change', function (e) {
        //                 var statuses = [];
        //
        //                 $.each($('.pipeline-select__dropdown__item__label'), function () {
        //                     if (!$(this).hasClass('is-checked')) return;
        //                     statuses.push($(this).find('input').attr('id'));
        //                 });
        //
        //                 checkboxes.statuses = statuses;
        //                 self.saveSettings(checkboxes);
        //             });
        //         },
        //         timeout: 2000
        //     });
        // }







        // // функция создания задачи
        // const createTasks = function(mutationsList) {
        //     // если в задачах или карточке
        //     if (AMOCRM.getBaseEntity() === 'todo' || AMOCRM.isCard() === true) {
        //         // отслеживаем изменение потомков для поиска элементов
        //         $.each(mutationsList, function () {
        //             if (this.type === 'childList') {
        //
        //                 var button = $('div.feed-compose .feed-note__button');
        //                 var create_type = $('div.feed-compose .feed-compose-switcher__text');
        //                 var inputHidden = $('div.feed-compose .js-control-contenteditable-input');
        //                 var inputText = $('div.feed-compose .js-task-text-textarea');
        //
        //                 // проверка на валидность длины задачи
        //                 const isInputLengthFalse = function () {
        //                     // удаляем пробелы в начале и конце, обновляем текст
        //                     inputHidden.val(inputHidden.val().trim());
        //                     inputText.text(inputHidden.val());
        //
        //                     // в случае неудачи выводим сообщение, красим и останавливаем кнопку
        //                     if (inputHidden.val().length < self.create_task_length) {
        //                         button.addClass('true_error_message');
        //                         self.showErrorMessageTask();
        //                         self.redFieldsTaskCreate();
        //                         return false;
        //                     }
        //                     return true;
        //                 }
        //
        //                 // если мы в сделках
        //                 if (AMOCRM.isCard() && AMOCRM.getBaseEntity() === 'leads') {
        //                     // обработчик на кнопке создания задачи
        //                     button.unbind('click');
        //                     button.bind('click', function () {
        //                         // если обязательность не стоит, пропускаем проверку
        //                         var checkboxes = self.toSettings();
        //                         if (!checkboxes.isChecked) return;
        //
        //                         // если текущего пользователя в настройках нет, пропускаем проверку
        //                         var manager = AMOCRM.constant('user').id;
        //                         var isUser = false;
        //                         $.each(checkboxes.managers, function (key, val) {
        //                             if (manager == val) isUser = true;
        //                         });
        //                         if (!isUser) return;
        //
        //                         // если статуса сделки в настройках нет, пропускаем проверку
        //                         var pipelineID, statusID, isStatus = false;
        //                         if (AMOCRM.data.current_card) {
        //                             pipelineID = AMOCRM.data.current_card.model.attributes['lead[PIPELINE_ID]'];
        //                             statusID = AMOCRM.data.current_card.model.attributes['lead[STATUS]'];
        //                         }
        //
        //                         if (!checkboxes.statuses || checkboxes.statuses.length === 0) return;
        //                         $.each(checkboxes.statuses, function (key, val) {
        //                             val = val.split('_');
        //                             if (pipelineID === val[1] && statusID === val[2]) isStatus = true;
        //                         });
        //                         if (!isStatus) return;
        //
        //                         // если не чат и не примечание (в карточке)
        //                         if (create_type.length) {
        //                             if (create_type.text() === 'Задача') {
        //                                 // проверка на валидность длины в карточке
        //                                 if (!isInputLengthFalse()) return false;
        //                             }
        //                         } else {
        //                             // если текущего пользователя и статуса нет, проверку не делаем
        //                             if (!isInputLengthFalse()) return false;
        //                         }
        //                     });
        //
        //                 } else {
        //                     // иначе, если в задачах или других карточках
        //                     button.unbind('click');
        //                     button.bind('click', function () {
        //                         // если обязательность не стоит, пропускаем проверку
        //                         var checkboxes = self.toSettings();
        //                         if (!checkboxes.isChecked) return;
        //
        //                         // если текущего пользователя в настройках нет, пропускаем проверку
        //                         var manager = AMOCRM.constant('user').id;
        //                         var isUser = false;
        //                         $.each(checkboxes.managers, function (key, val) {
        //                             if (manager == val) isUser = true;
        //                         });
        //                         if (!isUser) return;
        //
        //                         // если не чат и не примечание (в карточке)
        //                         if (create_type.length) {
        //                             if (create_type.text() === 'Задача') {
        //                                 // проверка на валидность длины в карточке
        //                                 if (!isInputLengthFalse()) return false;
        //                             }
        //                         } else {
        //                             // проверка на валидность длины в задачах
        //                             if (!isInputLengthFalse()) return false;
        //                         }
        //                     });
        //                 }
        //             }
        //         });
        //     }
        // };
        //
        // this.observerCreateTasks = new MutationObserver(createTasks);

        // // функция показа сообщения об ошибке
        // this.showErrorMessageTask = function () {
        //     var errorMessage = $('div.create_error_message_tasks');
        //     var button = $('div.feed-compose .feed-note__button');
        //
        //     // отображаем сообщение
        //     errorMessage.css('display', 'block');
        //
        //     // позиционируем относительно кнопки
        //     var resize = function () {
        //         errorMessage.offset({
        //             left: button.offset().left,
        //             top: button.offset().top - button.outerHeight() - 30
        //         });
        //     }
        //
        //     resize();
        //
        //     // при наведении мыши на кнопку показываем
        //     button.mouseover(function () {
        //         if (button.hasClass('true_error_message')) {
        //             errorMessage.css('display', 'block');
        //             resize();
        //         }
        //     });
        //
        //     // при потере фокуса скрываем
        //     button.mouseout(function () { errorMessage.css('display', 'none') });
        // }

        // // функция смены цвета полей при ошибке создания задачи
        // this.redFieldsTaskCreate = function () {
        //     var textarea, button = $('div.feed-compose .feed-note__button');
        //     if (!AMOCRM.isCard()) textarea = $('.feed-compose.feed-compose_task-modal');
        //
        //     // красим поля, если условие проверки не выполнено
        //     button.addClass('true_error_message');
        //     button.attr('style', 'border-color: #f37575 !important; background: #f37575 !important');
        //     if (!AMOCRM.isCard()) textarea.attr('style', 'border-color: #f37575 !important');
        //
        //     // возвращаем цвет textarea и/или кнопки в случае успеха
        //     $('.js-task-text-textarea').bind('input', function () {
        //         // если обязательность не стоит, пропускаем проверку
        //         var checkboxes = self.toSettings();
        //         if (!checkboxes.isChecked) return;
        //
        //         // если длина textarea меньше допустимой
        //         if ($('.js-task-text-textarea').text().trim().length < self.create_task_length) {
        //             button.addClass('true_error_message');
        //             button.attr('style', 'border-color: #f37575 !important; background: #f37575 !important');
        //             if (!AMOCRM.isCard()) textarea.attr('style', 'border-color: #f37575 !important');
        //         } else {
        //             // иначе, если textarea соответствует условию
        //             button.removeClass('true_error_message');
        //             button.attr('style', 'border-color: #4c8bf7 !important; background: #4c8bf7 !important');
        //             if (!AMOCRM.isCard()) textarea.attr('style', 'border-color: #d7d8da !important');
        //             $('div.create_error_message_tasks').css('display', 'none');
        //         }
        //     });
        // }

        // // функиця вызова всплывающих сообщений над кнопкой
        // this.getTemplate = function (template, params, callback) {
        //     params = (typeof params == 'object') ? params : {};
        //     template = template || '';
        //
        //     return self.render({
        //         href: '/templates/' + template + '.twig',
        //         base_path: self.params.path,
        //         load: callback
        //     }, params);
        // };




        // // функция добавления checkbox для выбора пользователей и воронок со статусами
        // this.addCheckboxSettings = function () {
        //     var blockControls = $('div.widget_settings_block__controls');
        //
        //     // вытаскиваем данные из системной переменной
        //     var checkboxes = self.toSettings();
        //
        //     // checbox выполнения задачи
        //     var createTaskCheckbox = self.addCheckbox(
        //         'create_task_checkbox',
        //         'create-task-checkbox',
        //         null,
        //         'Обязательность выполнения задачи'
        //     );
        //
        //     // checboxes wrapper
        //     var divCreateTaskCheckbox = `
        //         <div class="widget_settings_block__item_field create_task_checkbox_wrapper" style="margin-top: 5px;">
        //             <div class="widget_settings_block__input_field">
        //                 ${ createTaskCheckbox }
        //             </div>
        //         </div>
        //     `;
        //
        //     // добавляем checkbox'ы в настройки
        //     blockControls.before(divCreateTaskCheckbox);
        //     createTaskCheckbox = $('.create_task_checkbox_wrapper .control-checkbox');
        //
        //     // отображаем ранее сохраненные настройки
        //     if (checkboxes.isChecked) {
        //         createTaskCheckbox.addClass('is-checked');
        //         createTaskCheckbox.trigger('click');
        //         self.lastSettings(checkboxes);
        //     }
        //
        //     // checbox checked выполнения задачи
        //     createTaskCheckbox.unbind('change');
        //     createTaskCheckbox.bind('change', function () {
        //         // if checkked
        //         if (createTaskCheckbox.hasClass('is-checked')) self.lastSettings(checkboxes);
        //         else {
        //             // иначе удаляем созданные элементы
        //             $('.subscribers__wrapper').remove();
        //             $('.pipelines__wrapper').remove();
        //
        //             // обнуляем системную переменную
        //             checkboxes.isChecked = false;
        //             self.checkboxes = checkboxes;
        //             self.saveSettings(self.checkboxes);
        //         }
        //     });
        // }

        // // функция проверки на число из настроек виджета, иначе 0
        // this.createTaskToNumber = function () {
        //     self.set_settings({ create_task: parseInt(self.get_settings().create_task) });
        //     if (!Number.isInteger(self.get_settings().create_task)) self.set_settings({ create_task: 0 });
        //     self.create_task_length = self.get_settings().create_task;
        // }

        this.callbacks = {
            settings: function () {
                // преобразуем минимальное количество символов в число и выводим в настройки
                self.minLengthToInt();
                $('input[name="min_length"]').val(min_length);

                // если виджет не установлен, обнуляем минимальное количество символов
                if (self.get_install_status() === 'not_configured') {
                    self.set_settings({ min_length: 0 });
                    min_length = null;
                    $('input[name="min_length"]').val(0);
                }

                // добавляем чекбокс с настройками
                self.сheckboxSettings();
                // обновляем настройки виджета
                self.setSettings(checkboxes);
            },
            init: function () {
                return true;
            },
            bind_actions: function () {
                // // запускаем прослушку элементов
                // self.observerCreateTasks.observe($('body')[0], {
                //     childList: true,
                //     subtree: true,
                //     attributes: true
                // });

                return true;
            },
            render: function () {
                // в случае перезагрузки страницы или изменения значения
                if (min_length === null) self.minLengthToInt();

                // // template только для задач и карточек
                // if (AMOCRM.getBaseEntity() === 'todo' || AMOCRM.isCard() === true) {
                //     // сообщение об ошибке на кнопке закрытия задачи
                //     self.getTemplate('create_error_message_tasks', {}, function (template) {
                //         // добавляем элемент на страницу
                //         var errorMessage = template.render();
                //         if (!$('body .create_error_message_tasks').length) $('body').append(errorMessage);
                //     });
                // }

                return true;
            },
            dpSettings: function () {},
            advancedSettings: function () {},
            destroy: function () {
                // // останавливаем прослушку элементов
                // self.observerCreateTasks.disconnect();
            },
            contacts: {
                selected: function () {}
            },
            onSalesbotDesignerSave: function (handler_code, params) {},
            leads: {
                selected: function () {}
            },
            todo: {
                selected: function () {},
            },
            onSave: function () {
                // обнуляем для рендера
                min_length = null;
                return true;
            },
            onAddAsSource: function (pipeline_id) {}
        };
        return this;
    };
    return CustomWidget;
});