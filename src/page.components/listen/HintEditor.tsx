import { useEffect } from 'react';
import {  RawPodcastSubmit } from '../../store/types';
import $ from 'jquery';
import { FILLER_TEXT } from '../../Constants';

interface Props {
    content_array: string[],
    setContentArray: (val: string[]) => void,
    submit: RawPodcastSubmit
}


const HintEditor = ({ content_array, setContentArray, submit }: Props) => {
    useEffect(() => {
        // convert ve cung mot kieu dau cach
        var text = submit.podcast_result;
        var hint_indexes = submit.podcast_hints;
        var content_words = text.replace(/\s+/g, " ").split(" ");
        let html = content_words.map((e, index) => {
            var hint_index = hint_indexes.indexOf(index);
            if (hint_index <= -1) {
                return content_words[index];
            } else {
                var trim_word = content_array[hint_index].trim();
                var word = trim_word && trim_word != FILLER_TEXT  ? content_array[hint_index] : "";
                return `<input data-index='${hint_index}' style='width: ${content_words[index].length + 2}ch' class='js-hint-input' value="${word}"/>`
            }
        }).join(" ");
        $('.js-content').html(html);
        $('.js-hint-input').on('keydown', function (e) {
            var index = Number($(this).data('index'));
            if (e.key == 'Enter' || e.key == 'ArrowRight' || e.key == ' ') {
                e.preventDefault();
                if (hint_indexes.length > (index + 1)) {
                    index = index + 1;
                }
            }

            if (e.key == 'ArrowLeft') {
                e.preventDefault();
                if (index > 0) {
                    index = index - 1;
                }
            }

            $(`.js-hint-input[data-index=${index}]`).focus();
        });

        $('.js-hint-input').on('change', function (e) {
            var new_content_array = hint_indexes.map((e, index) => {
                var val = $(`.js-hint-input[data-index=${index}]`).val();
                val = (val ? val : '').toString().trim();

                return val ? val : FILLER_TEXT;
                
            })
            // console.log(new_content_array);
            setContentArray(new_content_array);
        });

        return () => {
            $('.js-hint-input').off('keydown');
        }
    }, [submit]);

    return (
        <div style={{ borderWidth: 1, fontFamily: `monospace` }} className='px-3 py-3 js-content border-gray-200 hint-wrapper rounded'>

        </div>
    )
};


export default HintEditor;