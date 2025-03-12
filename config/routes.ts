export default [
	{
		path: '/user',
		layout: false,
		routes: [
			{
				path: '/user/login',
				layout: false,
				name: 'login',
				component: './user/Login',
			},
			{
				path: '/user',
				redirect: '/user/login',
			},
		],
	},

	///////////////////////////////////
	// DEFAULT MENU
	{
		path: '/dashboard',
		name: 'Dashboard',
		component: './TrangChu',
		icon: 'HomeOutlined',
	},
	{
		path: '/gioi-thieu',
		name: 'About',
		component: './TienIch/GioiThieu',
		hideInMenu: true,
	},
	{
		path: '/random-user',
		name: 'RandomUser',
		component: './RandomUser',
		icon: 'ArrowsAltOutlined',
	},

	// DANH MUC HE THONG
	// {
	// 	name: 'DanhMuc',
	// 	path: '/danh-muc',
	// 	icon: 'copy',
	// 	routes: [
	// 		{
	// 			name: 'ChucVu',
	// 			path: 'chuc-vu',
	// 			component: './DanhMuc/ChucVu',
	// 		},
	// 	],
	// },
	{
		path: '/todo-list',
		name: 'TodoList',
		component: './TodoList',
		icon: 'CheckSquareOutlined',
	  },
	  {
		path: '/game-1',  
		name: 'Game1',
		component: './Game1',
		icon: 'PlayCircleOutlined',  
	},
	{
		path: '/game-2',  
		name: 'Game2',
		component: './Game2',
		icon: 'PlayCircleOutlined',  
	},
	{
		path: '/Oantuti',  
		name: 'Game Oẳn Tù Tì',
		component: './Oantuti',
		icon: 'PlayCircleOutlined',  
	},
	{
		path: '/question-bank',
		name: 'Ngân Hàng Câu Hỏi',
		icon: 'QuestionCircleOutlined', 
		routes: [
		  {
			path: '/question-bank',
			name: 'Tổng Quan',
		  },
		  {
			path: '/question-bank/subjects',
			name: 'Quản Lý Môn Học',
		  },
		  {
			path: '/question-bank/questions',
			name: 'Ngân Hàng Câu Hỏi',
		  },
		  {
			path: '/question-bank/questions/search',
			name: 'Tìm Kiếm Câu Hỏi',
			
		  },
		  {
			path: '/question-bank/exams',
			name: 'Quản Lý Đề Thi',
		  },
		],
	  },
	  {
		path: '/QuanLyLichHen',  
		name: 'Quản Lý Lịch Hẹn',
		icon: 'CalendarOutlined',
		component: './QuanLyLichHen', 
	},
	{
		path: '/notification',
		routes: [
			{
				path: './subscribe',
				exact: true,
				component: './ThongBao/Subscribe',
			},
			{
				path: './check',
				exact: true,
				component: './ThongBao/Check',
			},
			{
				path: './',
				exact: true,
				component: './ThongBao/NotifOneSignal',
			},
		],
		layout: false,
		hideInMenu: true,
	},
	{
		path: '/',
	},
	{
		path: '/403',
		component: './exception/403/403Page',
		layout: false,
	},
	{
		path: '/hold-on',
		component: './exception/DangCapNhat',
		layout: false,
	},
	{
		component: './exception/404',
	},
];
