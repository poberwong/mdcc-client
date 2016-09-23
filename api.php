<?php
include ROOT_DIR . '/vendor/simple_html_dom.php';
class MApis_Mdcc extends MApps_AppBase_BaseApiApp
{
    private static $default_avatar = 'http://noavatar.csdn.net/A/E/D/1_liaohuqiu.jpg';

    private static $topic_intro_replace = [
        '<br/>' => "\n",
        '<br>' => "\n",
        '&mdash;' => '—',
        ];

    private static $replace = [
        '<b>' => '',
        '</b>' => '',
        '<span>' => '',
        '</span>' => '',
        '&nbsp;' => '',
        '&amp;' => ' & ',
        '&ldquo;' => '“',
        '&rdquo;' => '”',
        '&mdash;' => '—',
        ];

    private static $session_id = array (
        '全体大会' => 1,
        'Android开发峰会' => 2,
        'iOS开发峰会' => 3,
        '产品与设计峰会' => 4,
        'VR开发者峰会' => 5,
        '硬件产品开发峰会' => 6,
        '移动直播技术专场' => 7,
        '跨平台开发专场' => 8,
        '人工智能与机器人专场' => 9,
        '物联网开发专场' => 10,
        '信息无障碍专场' => 11,
    );

    private static $session_id_inc = 1;
    private static $speaker_id_inc = 100;

    private static $replace_time = [
        ' ' => '',
        '：' => ':',
        ];

    private static $replace_session_time = [
        '时间：' => '',
        ];

    protected function checkAuth()
    {
    }

    private function fetchMainPage()
    {
        $html = file_get_html('http://mdcc.csdn.net/m/zone/mdcc_2016');

        // fetch session list
        $list = [];
        foreach ($html->find('.jjconpc') as $item)
        {
            $session_title = trim($item->find('h5', 0)->innertext());
            $session_intro = $item->find('p', 0)->innertext();
            $session_intro = strtr($session_intro, self::$replace);
            $list[$session_title] = $session_intro;
        }
        $this->session_list = $list;

        // fetch speaker list
        $list = [];
        foreach ($html->find('.jiaB') as $item)
        {
            $avatar = $item->find('img', 0)->src;

            $name_item = $item->next_sibling();
            $name = $name_item->innertext();

            $company_item = $name_item->next_sibling();
            $company = $company_item->innertext();

            $title_item = $company_item->next_sibling();
            $title = $title_item->innertext();

            $speaker = [];
            $speaker['speaker_name'] = $name;
            $speaker['speaker_avatar'] = $avatar;
            $speaker['speaker_company'] = $company;
            $speaker['speaker_title'] = $title;
            $list[$name] = $speaker;
        }
        $this->speaker_list = $list;
    }

    private function parseSessionTimeAndPlace($text, $session)
    {
        // 时间：9月23日 下午 地点：国家会议中心三层
        list($time, $place) = explode('地点：', $text);
        $time = strtr(trim($time), self::$replace_session_time);

        $session['session_time'] = $time;
        $session['session_place'] = $place;
        $session['session_time_and_place'] = $text;
        return $session;
    }

    private function parse()
    {
        $url = 'http://mdcc.csdn.net/m/zone/mdcc_2016/schedule_introduce';
        $html = file_get_html($url);

        $list1 = [];
        $list2 = [];

        foreach ($html->find('.ric_t') as $title)
        {
            $session_title = trim($title->innertext());
            $des = $title->next_sibling();

            $session = [];
            $session['session_title'] = $session_title;
            $session['session_id'] = $this->fetchSessionId($session_title);
            $session['session_intro'] = $this->fetchSessionIntro($session_title);
            $session_time_and_place = strtr($des->innertext(), self::$replace);
            $session = $this->parseSessionTimeAndPlace($session_time_and_place, $session);

            $next = $des;
            while (!($table = $next->next_sibling()->find('table', 0)))
            {
                $next = $next->next_sibling();
            }

            foreach (array_slice($table->find('tr'), 1) as $tr)
            {
                $topic = self::parseTopic($tr);
                if ($topic)
                {
                    $session['topics'][] = $topic;
                }
            }

            if (strpos($session['session_time_and_place'], '23日') !== false)
            {
                $list1[] = $session;
            }
            else
            {
                $list2[] = $session;
            }
        }

        return [$list1, $list2];
    }

    private function fetchSessionId($session_title)
    {
        if (isset(self::$session_id[$session_title]))
        {
            return self::$session_id[$session_title];
        }
        foreach (self::$session_id as $key => $value)
        {
            if (strpos($session_title, $key) !== false)
            {
                return $value;
            }
        }
        self::$session_id_inc++;
        $id = self::$session_id_inc + count(self::$session_id);
        return $id;
    }

    private function fetchSessionIntro($session_title)
    {
        if (isset($this->session_list[$session_title]))
        {
            return $this->session_list[$session_title];
        }
        foreach ($this->session_list as $key => $value)
        {
            if (strpos($session_title, $key) !== false)
            {
                return $value;
            }
        }
        return '';
    }

    private function parseTopic($tr)
    {
        $td_list = $tr->find('td');
        $topic = [];
        if (count($td_list) > 1)
        {
            $time_str = strtr($td_list[0]->innertext(), self::$replace_time);
            list($time_start, $time_end) = explode('-', $time_str);

            $topic = $this->processTopicTitle($topic, $td_list);
            $topic['time_start'] = $time_start;
            $topic['time_end'] = $time_end;
            $topic['time'] = $time_start . ' - ' . $time_end;

            $topic = $this->processNameAndTitleForTopicSpeaker($topic, $td_list);

            $topic['is_rest'] = strpos($topic['title'], '午休') !== false;
        }
        return $topic;
    }

    private function processTopicTitle($topic, $td_list)
    {
        $specific_title = $td_list[1]->find('b', 0);
        if ($specific_title)
        {
            $topic_title = $specific_title->innertext();
        }
        else
        {
            $topic_title = $td_list[1]->find('span', 0)->innertext();
        }
        $topic_title = strtr($topic_title, self::$replace);
        $topic['title'] = $topic_title;
        return $topic;
    }

    private function processNameAndTitleForTopicSpeaker($topic, $td_list)
    {
        $name_link = $td_list[1]->find('a', 0);
        if ($name_link)
        {
            $name = $name_link->innertext();
            $link = $name_link->href;
            $url_info = parse_url($link);
            $info = MCore_Tool_Http::parse_str($url_info['query']);
            $speaker_id = intval($info['id']);

            $intro_and_avatar = $this->fetchSpeakerTopicIntroAndAvatar($speaker_id, $link);

            $topic['id'] = $speaker_id;
            $topic['speaker_id'] = $speaker_id;
            $topic['topic_intro'] = $intro_and_avatar['topic_intro'];
            $topic['speaker_avatar'] = $intro_and_avatar['speaker_avatar'];

            $p = $td_list[1]->find('p', 0)->innertext();
            list($_p, $intro) = explode('</span>', $p);
        }
        else
        {
            $speaker_text = $td_list[1]->find('p', 0)->innertext();
            list($name, $intro) = explode('</span>', $speaker_text);

            self::$speaker_id_inc += 1;
            $speaker_id = self::$speaker_id_inc;

            $topic['id'] = $speaker_id;
            $topic['speaker_id'] = $speaker_id;
            $topic['topic_intro'] = '';
            $topic['speaker_avatar'] = self::$default_avatar;
        }
        $intro = trim(strtr($intro, self::$replace));
        $name = strtr($name, self::$replace);

        $topic['speaker_name'] = $name;
        $topic['speaker_title'] = $intro ? $intro : '';
        return $topic;
    }

    protected function main()
    {
        $that = $this;
        $getFn = function() {
            $this->fetchMainPage();
            $list = $this->parse();
            $data = [];
            $data['last_update'] = date('Y-m-d H:i:s');
            $data['list'] = $list;
            return $data;
        };

        // $data = MCore_Tool_Cache::fetch('mdcc-1', $getFn, null, -1);
        $data = MCore_Tool_Cache::fetch(self::$cache_key_pre_for_result, $getFn, null, 3600);
        $this->setData($data);
    }

    private function fetchSpeakerTopicIntroAndAvatar($speaker_id, $link)
    {
        $getFn = function() use ($link) {
            $intro = '';

            $html = file_get_html($link);
            $intro_element = $html->find('.jB_Detail .jsp', 2);
            if ($intro_element)
            {
                $intro = $intro_element->innertext();
                $intro = strtr($intro, self::$topic_intro_replace);
            }
            $avatar_element = $html->find('.jB_Detail .jiaB img', 0);
            $avatar = self::$default_avatar;
            if ($avatar_element)
            {
                $avatar = $avatar_element->src;
            }

            $data = [];
            $data['speaker_avatar'] = $avatar;
            $data['topic_intro'] =  $intro;
            return $data;
        };

        // $data = MCore_Tool_Cache::fetch('speaker-1-' . $speaker_id, $getFn, null, -1);
        $data = MCore_Tool_Cache::fetch(self::$cache_key_pre_for_topic . $speaker_id, $getFn, null, 3600 * 20 + $speaker_id * 100);
        return $data;
    }

    private static $cache_key_pre_for_topic = 'speaker-9-';
    private static $cache_key_pre_for_result = 'mdcc-17';
}
