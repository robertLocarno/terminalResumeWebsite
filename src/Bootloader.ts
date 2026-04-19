import SystemEvent from "./SystemEvent";
import SystemFacade from "./SystemFacade";
import { getRandomInt } from "./utils";

class Bootloader {
	static delayBounds = { min: 5, max: 40 };

	static initLines = [
		"Welcome to rlSYS\r\n",
		"rlSYS Kernal Version 0.0.1: Thu Mar 12 18:23:30 MTN 2026; root:xrl-0000.0.01-i/PREVIEW_x86_64\r\n",
		"page_bootstrap: 5242880 bytes free, origin quota unbounded\r\n",
		"text submap [0x0000-0x64000] 409600 bytes, ghostty-vt.wasm (r-x)\r\n",
		"zone leak detection disabled\r\n",
		"scheduler: cooperative event loop, 16.67 ms frame quantum (60Hz)\r\n",
		"timeslicing: non-preemptive, long-task threshold 50ms\r\n",
		"mig_table_max_displ = 74\r\n",
		"TSC Deadline Timer not supported\r\n",
		"CPU: ProcessorId=1 LocalApicId=2 Enabled\r\n",
		"CPU: ProcessorId=2 LocalApicId=4 Enabled\r\n",
		"CPU: ProcessorId=3 LocalApicId=6 Enabled\r\n",
		"CPU: ProcessorId=4 LocalApicId=8 Enabled\r\n",
		"CPU: ProcessorId=5 LocalApicId=10 Enabled\r\n",
		"CPU: ProcessorId=6 LocalApicId=12 Enabled\r\n",
		"CPU: ProcessorId=7 LocalApicId=14 Enabled\r\n",
		"CPU: ProcessorId=8 LocalApicId=16 Enabled\r\n",
		"CPU: ProcessorId=9 LocalApicId=18 Disabled\r\n",
		"calling mpo_policy_init for BrowserSandbox\r\n",
		"Security policy loaded: Browser sandbox policy (BrowserSandbox)\r\n",
		"\r\n",
		"IOAPIC: Version 0x20 Vectors 64:87\r\n",
		"ACPI: System State [S0 S3 S4 S5] (S3)\r\n",
		"PFM64 0xf10000000, 0xf00000000\r\n",
		"[ PCI configuration begin ]\r\n",
		"rlIntelCPUPowerManagement: Turbo Ratios 0046\r\n",
		"rlIntelCPUPowerManagement: (built 03:14:07 Apr 18 2026) initialization complete\r\n",
		"console relocated to 0xf10000000\r\n",
		"PCI configuration changed (bridge=16 device=4 cardbus=0)\r\n",
		"[ PCI configuration end, bridges 12 devices 16 ]\r\n",
		"mbinit: done [64 MB total pool size, (42/21) split]\r\n",
		"Pthread support ABORTS when sync kernel primitives misused\r\n",
		"com.rl.rlFSCompressionTypeZlib kmod start\r\n",
		"com.rl.rlTrololoBootScreen kmod start\r\n",
		"com.rl.rlFSCompressionTypeZlib load succeeded\r\n",
		"com.rl.rlFSCompressionTypeDataless load succeeded\r\n",
		"rlV8JITCompilerClient: ready (turbofan enabled, sparkplug warmed)\r\n",
		"BTCOEXIST off — no ad blocker detected, continuing in trusting mode\r\n",
		"navigator.connection: effectiveType=4g, downlink~10Mbps, rtt~45ms\r\n",
		"WebUSB: deferred — navigator.usb.requestDevice() requires user gesture (and won't get one)\r\n",
		"FireWire (OHCI) not found, built-in never active — it's 2026, nobody has FireWire\r\n",
		"rooting via document.cookie from /chosen: session=F5670083-AC74-33D3-8361-AC1977EE4AA2 (fabricated)\r\n",
		"Waiting on <dict ID=\"0\"><key>IOProviderClass</key><string ID=\"1\">window</string></dict>\r\n",
		"Got boot device = IOService:/rlNavigatorPlatform/UA@0/rlOriginQuota/HTTPS@443,0/IOBlockStorageDriver/rl CacheAPI 60pct Media/IOOriginPartitionScheme/Customer@2\r\n",
		"BSD root: origin[0], major 443 (TLS 1.3), minor 0\r\n",
		"Kernel is ES2025 (strict mode, no 'with' blocks, sorry)\r\n",
		"IOThunderboltSwitch::webUSBWriteDWord - status = 0xDEFERRED_NO_USER_GESTURE\r\n",
		"IOThunderboltSwitch::webUSBWriteDWord - status = 0xSTILL_DEFERRED\r\n",
		"IOThunderboltSwitch::webUSBWriteDWord - status = 0xGIVING_UP_FOR_NOW\r\n",
		"rlPointerEventDriver: listeners attached (mouse, touch, pen) — PointerEvents FTW\r\n",
		"[WebBluetoothController::requestDevice] deferred — requires user gesture (same as WebUSB, see above)\r\n",
		"AirPort_fetch: MAC 00:00:00:00:00:00 (fingerprint-mitigated placeholder, not a real NIC)\r\n",
		"IOCORSController::preflightComplete(): Access-Control-Allow-Origin: *\r\n",
		"Created virtif 0xDEADBEEF w3c0 (RTCPeerConnection, idle)\r\n",
		"WebSocketEnet: readyState OPEN — sessionId c8:2a:14:57:a4:7a (also fabricated)\r\n",
		"Previous Shutdown Cause: 3 (tab closed with unsaved form data, you monster)\r\n",
		"DSMOS has arrived — Don't Scrape My Own Site\r\n",
		"en1: navigator.language set to 'en-US'\r\n",
		"en1: Supported channels 200 201 204 301 302 304 307 400 401 403 404 405 418 429 500 502 503 504\r\n",
		"wlEvent: WebSocket Link UP (but there's no server, it's a terminal, we're all pretending)\r\n",
		"navigator.onLine: true (this lies if you pull the cord, trust but verify)\r\n",
		"virtual bool rlKeyEventClient::addEventListener('keydown', handler, {passive: true}):\r\n",
		"DENIED: crypto.subtle requires secure context (we're secure, proceeding) (e00002c1)\r\n",
		"Jettisoning kernel linker (~400KB ghostty-vt.wasm now resident)\r\n",
		"Resetting IOCatalogue. Apologies to any engineers reading this closely.\r\n",
		"\r\n",
		"ghostty-web successfully initialized\r\n",
		"support https://github.com/coder/ghostty-web\r\n",
		"bash-emulator successfully initialized\r\n",
		"support https://github.com/trybash/bash-emulator\r\n",
		"\r\n",
		"Copyright (c) 2026\r\n",
		"rlSYS_Message: dontReadTooClosely_itsAllMadeUp\r\n",
		"\r\n",
		"Boot Complete",
	];

	terminal;
	emulator;
	system: SystemFacade;

	constructor(system: SystemFacade) {
		this.system = system;
		this.terminal = system.terminal;
		this.emulator = system.terminal;
	}

	async start() {
		for (const line of Bootloader.initLines) {
			const event = new SystemEvent(
				async () => this.terminal.write(line),
				getRandomInt(Bootloader.delayBounds.min, Bootloader.delayBounds.max),
			);

			this.system.enqueueEvent(event);
		}

		this.system.enqueueEvent(new SystemEvent(
			() => console.log("We done"),
			1000
		));

		this.system.startEvents();
	}
}

export default Bootloader;
