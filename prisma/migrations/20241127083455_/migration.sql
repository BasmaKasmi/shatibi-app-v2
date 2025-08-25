-- CreateTable
CREATE TABLE `admin_connect_stat` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `start` DATETIME(0) NULL,
    `end` DATETIME(0) NULL,
    `token` VARCHAR(255) NULL,
    `user` VARCHAR(255) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `admin_contact` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `last_name` VARCHAR(70) NULL,
    `first_name` VARCHAR(70) NULL,
    `external` BOOLEAN NULL,
    `mail` VARCHAR(200) NULL,
    `phone` VARCHAR(20) NULL,
    `mobile` VARCHAR(20) NULL,
    `sel` BOOLEAN NULL,
    `mail_to` BOOLEAN NULL,
    `sexe` VARCHAR(1) NULL,
    `univers` VARCHAR(1) NULL,
    `mother_mobile` VARCHAR(20) NULL,
    `father_mobile` VARCHAR(20) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `admin_crontask` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `commands` LONGTEXT NOT NULL,
    `intervalcom` INTEGER NOT NULL,
    `lastrun` DATETIME(0) NULL,
    `active` BOOLEAN NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `admin_crud_student` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATETIME(0) NOT NULL,
    `operation` VARCHAR(255) NOT NULL,
    `student_id` INTEGER NOT NULL,
    `student_name` VARCHAR(255) NOT NULL,
    `user` VARCHAR(255) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `admin_message` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `subject` VARCHAR(255) NULL,
    `message` LONGTEXT NULL,
    `date` DATE NULL,
    `attach_name` VARCHAR(255) NULL,
    `univers` VARCHAR(1) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `admin_role` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `plainText` VARCHAR(100) NOT NULL,
    `code` VARCHAR(100) NOT NULL,
    `sel` BOOLEAN NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `admin_setting` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nomsociete` VARCHAR(255) NOT NULL,
    `pathway_menu` BOOLEAN NULL,
    `department_menu` BOOLEAN NULL,
    `level_menu` BOOLEAN NULL,
    `centre_name` VARCHAR(255) NULL,
    `centre_adresse` VARCHAR(255) NULL,
    `centre_zip` VARCHAR(10) NULL,
    `centre_city` VARCHAR(100) NULL,
    `centre_phone` VARCHAR(20) NULL,
    `centre_url` VARCHAR(255) NULL,
    `centre_mail` VARCHAR(255) NULL,
    `assess_abort` BOOLEAN NULL,
    `centre_mail_child` VARCHAR(255) NULL,
    `centre_mail_pwd` VARCHAR(255) NULL,
    `centre_mail_smtp` VARCHAR(255) NULL,
    `centre_mail_child_pwd` VARCHAR(255) NULL,
    `centre_mail_child_smtp` VARCHAR(255) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `admin_utilisateur` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `roles` LONGTEXT NOT NULL,
    `teacher_id` INTEGER NULL,
    `year_id` INTEGER NULL,
    `email` VARCHAR(255) NOT NULL,
    `enabled` BOOLEAN NULL,
    `last_login` DATETIME(0) NULL,
    `reset_token` VARCHAR(255) NULL,
    `agenda_bg_color` VARCHAR(50) NULL,
    `agenda_fg_color` VARCHAR(50) NULL,
    `allow_agenda` LONGTEXT NULL,
    `acc_home_sub` BOOLEAN NULL,
    `acc_home_cash` BOOLEAN NULL,
    `acc_home_comparison` BOOLEAN NULL,
    `acc_home_school` BOOLEAN NULL,
    `acc_home_abs` BOOLEAN NULL,
    `acc_home_stu` BOOLEAN NULL,
    `acc_home_msg` BOOLEAN NULL,
    `acc_home_sec` BOOLEAN NULL,
    `acc_school_plan` BOOLEAN NULL,
    `acc_school_trombi` BOOLEAN NULL,
    `acc_school_assess` BOOLEAN NULL,
    `acc_school_group` BOOLEAN NULL,
    `acc_school_teacher` BOOLEAN NULL,
    `acc_school_arch` BOOLEAN NULL,
    `acc_school_tdb` BOOLEAN NULL,
    `acc_sec_agenda` BOOLEAN NULL,
    `acc_sec_contact` BOOLEAN NULL,
    `acc_sec_rack` BOOLEAN NULL,
    `acc_arch_stu` BOOLEAN NULL,
    `acc_tdb_group` BOOLEAN NULL,
    `acc_tdb_tdb` BOOLEAN NULL,
    `acc_tdb_abs` BOOLEAN NULL,
    `acc_tdb_pedago` BOOLEAN NULL,
    `acc_teach_assess` BOOLEAN NULL,
    `acc_teach_rack` BOOLEAN NULL,
    `acc_teach_abs` BOOLEAN NULL,
    `acc_teach_book` BOOLEAN NULL,
    `back_route` VARCHAR(50) NULL,
    `user_agenda_view` VARCHAR(50) NULL,
    `system` BOOLEAN NULL,
    `univers` VARCHAR(1) NULL,
    `acc_adult` BOOLEAN NULL,
    `acc_child` BOOLEAN NULL,
    `acc_tdb_logging` BOOLEAN NULL,
    `teacherChild_id` INTEGER NULL,

    UNIQUE INDEX `UNIQ_80062ABAF85E0677`(`username`),
    UNIQUE INDEX `UNIQ_80062ABAE7927C74`(`email`),
    INDEX `IDX_80062ABA40C1FEA7`(`year_id`),
    INDEX `IDX_80062ABA41807E1D`(`teacher_id`),
    INDEX `IDX_80062ABA9D9ECC71`(`teacherChild_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `archive_agenda` (
    `id` INTEGER NOT NULL,
    `year_id` INTEGER NULL,
    `date` DATE NULL,
    `assessment` BOOLEAN NULL,
    `attendance` BOOLEAN NULL,
    `control` BOOLEAN NULL,
    `att_valid` BOOLEAN NULL,
    `groupHeader_id` INTEGER NULL,
    `present` INTEGER NULL,
    `percent` DECIMAL(5, 2) NULL,
    `univers` VARCHAR(1) NULL,

    INDEX `IDX_D1E8DC6240C1FEA7`(`year_id`),
    INDEX `IDX_D1E8DC628BF89464`(`groupHeader_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `archive_assess_header` (
    `id` INTEGER NOT NULL,
    `module_id` INTEGER NOT NULL,
    `year_id` INTEGER NULL,
    `description` VARCHAR(255) NULL,
    `skill_description` VARCHAR(255) NULL,
    `date` DATE NOT NULL,
    `ratio_org` INTEGER NULL,
    `transcript` BOOLEAN NULL,
    `semester` VARCHAR(2) NULL,
    `assessGranding_id` INTEGER NULL,
    `assessPattern_id` INTEGER NOT NULL,
    `groupHeader_id` INTEGER NOT NULL,
    `mode` VARCHAR(20) NULL,
    `univers` VARCHAR(1) NULL,

    INDEX `IDX_2F5AA62A40C1FEA7`(`year_id`),
    INDEX `IDX_2F5AA62A4AF02AB3`(`assessGranding_id`),
    INDEX `IDX_2F5AA62A8696B61A`(`assessPattern_id`),
    INDEX `IDX_2F5AA62A8BF89464`(`groupHeader_id`),
    INDEX `IDX_2F5AA62AAFC2B591`(`module_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `archive_assess_pattern` (
    `id` INTEGER NOT NULL,
    `department_id` INTEGER NULL,
    `year_id` INTEGER NOT NULL,
    `description` VARCHAR(255) NULL,
    `start_date` DATE NULL,
    `end_date` DATE NULL,
    `factor` INTEGER NULL,
    `assessType_id` INTEGER NULL,
    `code` VARCHAR(10) NULL,
    `admin` BOOLEAN NULL,
    `univers` VARCHAR(1) NULL,
    `target` VARCHAR(5) NULL,

    INDEX `IDX_9425EF7040C1FEA7`(`year_id`),
    INDEX `IDX_9425EF70A3A7EE89`(`assessType_id`),
    INDEX `IDX_9425EF70AE80F5DF`(`department_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `archive_assessment` (
    `id` INTEGER NOT NULL,
    `studiant_id` INTEGER NOT NULL,
    `note_org` DECIMAL(4, 1) NULL,
    `note` DECIMAL(4, 1) NULL,
    `skill_description` VARCHAR(255) NULL,
    `page_from` INTEGER NULL,
    `page_to` INTEGER NULL,
    `page_validate` DECIMAL(4, 1) NULL,
    `detail` BOOLEAN NULL,
    `nb_question` INTEGER NULL,
    `detail_valid` BOOLEAN NULL,
    `transcript` BOOLEAN NULL,
    `absent` BOOLEAN NULL,
    `assessHeader_id` INTEGER NOT NULL,
    `assessGranding_id` INTEGER NULL,
    `sourateFrom_id` INTEGER NULL,
    `sourateTo_id` INTEGER NULL,
    `no_note` BOOLEAN NULL,
    `no_validate` BOOLEAN NULL,
    `univers` VARCHAR(1) NULL,

    INDEX `IDX_35C1EB953D68839C`(`assessHeader_id`),
    INDEX `IDX_35C1EB954AF02AB3`(`assessGranding_id`),
    INDEX `IDX_35C1EB954E910A92`(`sourateTo_id`),
    INDEX `IDX_35C1EB9555EF9145`(`sourateFrom_id`),
    INDEX `IDX_35C1EB959BA9BF2B`(`studiant_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `archive_attendance` (
    `id` INTEGER NOT NULL,
    `absence_id` INTEGER NULL,
    `studiant_id` INTEGER NULL,
    `contact_id` INTEGER NULL,
    `date` DATE NULL,
    `present` BOOLEAN NULL,
    `comment` VARCHAR(255) NULL,
    `evidence` VARCHAR(255) NULL,
    `guest` BOOLEAN NULL,
    `abort` BOOLEAN NULL,
    `mail` BOOLEAN NULL,
    `groupHeader_id` INTEGER NOT NULL,
    `resignation` BOOLEAN NULL,
    `swap` BOOLEAN NULL,
    `univers` VARCHAR(1) NULL,
    `module_id` INTEGER NULL,

    INDEX `IDX_AF70DB742DFF238F`(`absence_id`),
    INDEX `IDX_AF70DB748BF89464`(`groupHeader_id`),
    INDEX `IDX_AF70DB749BA9BF2B`(`studiant_id`),
    INDEX `IDX_AF70DB74AFC2B591`(`module_id`),
    INDEX `IDX_AF70DB74E7A1254A`(`contact_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `archive_coran_revision` (
    `id` INTEGER NOT NULL,
    `assessment_id` INTEGER NULL,
    `question` VARCHAR(255) NULL,
    `no_granding` BOOLEAN NULL,
    `granding1` INTEGER NULL,
    `granding2` INTEGER NULL,
    `granding3` INTEGER NULL,
    `granding4` INTEGER NULL,
    `pages` DECIMAL(5, 2) NULL,
    `total` DECIMAL(5, 2) NULL,
    `univers` VARCHAR(1) NULL,

    INDEX `IDX_7C8878C1DD3DD5F1`(`assessment_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `archive_discount` (
    `id` INTEGER NOT NULL,
    `year_id` INTEGER NOT NULL,
    `studiant_id` INTEGER NOT NULL,
    `history_id` INTEGER NULL,
    `date` DATE NULL,
    `cause` VARCHAR(255) NULL,
    `amount` DECIMAL(7, 2) NULL,
    `repayment` BOOLEAN NULL,
    `sup` BOOLEAN NULL,
    `payment_id` INTEGER NULL,
    `cheque_number` VARCHAR(20) NULL,
    `univers` VARCHAR(1) NULL,

    INDEX `IDX_CC8F7B621E058452`(`history_id`),
    INDEX `IDX_CC8F7B6240C1FEA7`(`year_id`),
    INDEX `IDX_CC8F7B624C3A3BB`(`payment_id`),
    INDEX `IDX_CC8F7B629BA9BF2B`(`studiant_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `archive_due_studiant` (
    `id` INTEGER NOT NULL,
    `year_id` INTEGER NOT NULL,
    `studiant_id` INTEGER NOT NULL,
    `motive_id` INTEGER NULL,
    `univers` VARCHAR(1) NULL,

    INDEX `IDX_A7E059C740C1FEA7`(`year_id`),
    INDEX `IDX_A7E059C79658649C`(`motive_id`),
    INDEX `IDX_A7E059C79BA9BF2B`(`studiant_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `archive_gain` (
    `id` INTEGER NOT NULL,
    `year_id` INTEGER NOT NULL,
    `studiant_id` INTEGER NOT NULL,
    `history_id` INTEGER NULL,
    `calculated` DECIMAL(7, 2) NULL,
    `really` DECIMAL(7, 2) NULL,
    `sup` BOOLEAN NULL,
    `univers` VARCHAR(1) NULL,

    INDEX `IDX_E0B0FB9B1E058452`(`history_id`),
    INDEX `IDX_E0B0FB9B40C1FEA7`(`year_id`),
    INDEX `IDX_E0B0FB9B9BA9BF2B`(`studiant_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `archive_group_content` (
    `id` INTEGER NOT NULL,
    `studiant_id` INTEGER NOT NULL,
    `history_id` INTEGER NULL,
    `abort` BOOLEAN NULL,
    `date_abort` DATETIME(0) NULL,
    `next_level` BOOLEAN NULL,
    `swap` BOOLEAN NULL,
    `sup` BOOLEAN NULL,
    `groupHeader_id` INTEGER NOT NULL,
    `resignation` BOOLEAN NULL,
    `entry_date` DATETIME(0) NULL,
    `motive` VARCHAR(255) NULL,
    `swapToGroup_id` INTEGER NOT NULL,
    `univers` VARCHAR(1) NULL,
    `user` VARCHAR(100) NULL,
    `appreciation` LONGTEXT NULL,

    INDEX `IDX_6988D64B1E058452`(`history_id`),
    INDEX `IDX_6988D64B8BF89464`(`groupHeader_id`),
    INDEX `IDX_6988D64B9BA9BF2B`(`studiant_id`),
    INDEX `IDX_6988D64B9CC2EB2E`(`swapToGroup_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `archive_group_header` (
    `id` INTEGER NOT NULL,
    `year_id` INTEGER NOT NULL,
    `classroom_id` INTEGER NOT NULL,
    `slot_id` INTEGER NOT NULL,
    `level_id` INTEGER NOT NULL,
    `description` VARCHAR(255) NULL,
    `code` VARCHAR(20) NULL,
    `max_male` INTEGER NULL,
    `max_female` INTEGER NULL,
    `nb_m_studiant` INTEGER NULL,
    `nb_f_studiant` INTEGER NULL,
    `valid` BOOLEAN NULL,
    `sel` BOOLEAN NULL,
    `dash` BOOLEAN NULL,
    `sup` BOOLEAN NULL,
    `mail_to` BOOLEAN NULL,
    `pricingType_id` INTEGER NULL,
    `module_id` INTEGER NULL,
    `univers` VARCHAR(1) NULL,
    `short_description` VARCHAR(255) NULL,
    `auto_valid` BOOLEAN NULL,
    `next_level` BOOLEAN NULL,
    `next_required` BOOLEAN NULL,

    INDEX `IDX_F14DC2CA40C1FEA7`(`year_id`),
    INDEX `IDX_F14DC2CA59E5119C`(`slot_id`),
    INDEX `IDX_F14DC2CA5FB14BA7`(`level_id`),
    INDEX `IDX_F14DC2CA6278D5A8`(`classroom_id`),
    INDEX `IDX_F14DC2CA695113B2`(`pricingType_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `archive_group_module_teacher` (
    `id` INTEGER NOT NULL,
    `module_id` INTEGER NULL,
    `teacher_id` INTEGER NULL,
    `sup` BOOLEAN NULL,
    `groupHeader_id` INTEGER NULL,
    `univers` VARCHAR(1) NULL,

    INDEX `IDX_CF5B928841807E1D`(`teacher_id`),
    INDEX `IDX_CF5B92888BF89464`(`groupHeader_id`),
    INDEX `IDX_CF5B9288AFC2B591`(`module_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `archive_group_multiple` (
    `id` INTEGER NOT NULL,
    `module_id` INTEGER NULL,
    `slot_id` INTEGER NULL,
    `sup` BOOLEAN NULL,
    `day` VARCHAR(2) NULL,
    `groupHeader_id` INTEGER NULL,

    INDEX `IDX_4B24B3B659E5119C`(`slot_id`),
    INDEX `IDX_4B24B3B68BF89464`(`groupHeader_id`),
    INDEX `IDX_4B24B3B6AFC2B591`(`module_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `archive_group_number` (
    `id` INTEGER NOT NULL,
    `date` DATETIME(0) NULL,
    `numberM` INTEGER NULL,
    `numberF` INTEGER NULL,
    `groupHeader_id` INTEGER NOT NULL,
    `univers` VARCHAR(1) NULL,

    INDEX `IDX_9AF755F8BF89464`(`groupHeader_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `archive_module` (
    `id` INTEGER NOT NULL,
    `department_id` INTEGER NOT NULL,
    `year_id` INTEGER NOT NULL,
    `description` VARCHAR(255) NULL,
    `code` VARCHAR(10) NULL,
    `start_date` DATE NULL,
    `end_date` DATE NULL,
    `sel` BOOLEAN NULL,
    `sup` BOOLEAN NULL,
    `close` BOOLEAN NULL,
    `univers` VARCHAR(1) NULL,

    UNIQUE INDEX `UNIQ_F121323D77153098`(`code`),
    INDEX `IDX_F121323D40C1FEA7`(`year_id`),
    INDEX `IDX_F121323DAE80F5DF`(`department_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `archive_module_teacher` (
    `module_id` INTEGER NOT NULL,
    `teacher_id` INTEGER NOT NULL,

    INDEX `IDX_5C2E1A0141807E1D`(`teacher_id`),
    INDEX `IDX_5C2E1A01AFC2B591`(`module_id`),
    PRIMARY KEY (`module_id`, `teacher_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `archive_pattern_module` (
    `assesspattern_id` INTEGER NOT NULL,
    `module_id` INTEGER NOT NULL,

    INDEX `IDX_82245855AFC2B591`(`module_id`),
    INDEX `IDX_82245855C9CBB5CA`(`assesspattern_id`),
    PRIMARY KEY (`assesspattern_id`, `module_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `archive_schedule` (
    `id` INTEGER NOT NULL,
    `payment_id` INTEGER NULL,
    `year_id` INTEGER NULL,
    `studiant_id` INTEGER NULL,
    `history_id` INTEGER NULL,
    `date` DATE NULL,
    `amount` DECIMAL(7, 2) NULL,
    `exchange` BOOLEAN NULL,
    `postponed` BOOLEAN NULL,
    `cheque_name` VARCHAR(100) NULL,
    `solded` BOOLEAN NULL,
    `cheque_number` VARCHAR(20) NULL,
    `comparison` BOOLEAN NULL,
    `sup` BOOLEAN NULL,
    `imp` BOOLEAN NULL,
    `imp_date` DATE NULL,
    `bankName_id` INTEGER NULL,
    `univers` VARCHAR(1) NULL,

    INDEX `IDX_7757DE971E058452`(`history_id`),
    INDEX `IDX_7757DE9740C1FEA7`(`year_id`),
    INDEX `IDX_7757DE974C3A3BB`(`payment_id`),
    INDEX `IDX_7757DE9767FC6DB4`(`bankName_id`),
    INDEX `IDX_7757DE979BA9BF2B`(`studiant_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `archive_single_assessment` (
    `id` INTEGER NOT NULL,
    `studiant_id` INTEGER NOT NULL,
    `module_id` INTEGER NOT NULL,
    `year_id` INTEGER NULL,
    `description` VARCHAR(255) NULL,
    `date` DATE NOT NULL,
    `note_org` DECIMAL(4, 1) NULL,
    `note` DECIMAL(4, 1) NULL,
    `skill_description` VARCHAR(255) NULL,
    `page_from` INTEGER NULL,
    `page_to` INTEGER NULL,
    `page_validate` DECIMAL(4, 1) NULL,
    `detail` BOOLEAN NULL,
    `nb_question` INTEGER NULL,
    `detail_valid` BOOLEAN NULL,
    `ratio_org` INTEGER NULL,
    `mode` VARCHAR(20) NULL,
    `semester` VARCHAR(2) NULL,
    `transcript` BOOLEAN NULL,
    `absent` BOOLEAN NULL,
    `no_note` BOOLEAN NULL,
    `no_validate` BOOLEAN NULL,
    `univers` VARCHAR(1) NULL,
    `groupHeader_id` INTEGER NOT NULL,
    `assessGranding_id` INTEGER NULL,
    `assessPattern_id` INTEGER NOT NULL,
    `sourateFrom_id` INTEGER NULL,
    `sourateTo_id` INTEGER NULL,

    INDEX `IDX_589D96FA40C1FEA7`(`year_id`),
    INDEX `IDX_589D96FA4AF02AB3`(`assessGranding_id`),
    INDEX `IDX_589D96FA4E910A92`(`sourateTo_id`),
    INDEX `IDX_589D96FA55EF9145`(`sourateFrom_id`),
    INDEX `IDX_589D96FA8696B61A`(`assessPattern_id`),
    INDEX `IDX_589D96FA8BF89464`(`groupHeader_id`),
    INDEX `IDX_589D96FA9BA9BF2B`(`studiant_id`),
    INDEX `IDX_589D96FAAFC2B591`(`module_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `archive_single_coran_revision` (
    `id` INTEGER NOT NULL,
    `assessment_id` INTEGER NULL,
    `question` VARCHAR(255) NULL,
    `no_granding` BOOLEAN NULL,
    `granding1` INTEGER NULL,
    `granding2` INTEGER NULL,
    `granding3` INTEGER NULL,
    `granding4` INTEGER NULL,
    `pages` DECIMAL(5, 2) NULL,
    `total` DECIMAL(5, 2) NULL,
    `univers` VARCHAR(1) NULL,

    INDEX `IDX_66E96B2ADD3DD5F1`(`assessment_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `archive_stat_absence` (
    `id` INTEGER NOT NULL,
    `studiant_id` INTEGER NULL,
    `year_id` INTEGER NULL,
    `absence_id` INTEGER NULL,
    `startDate` DATE NULL,
    `endDate` DATE NULL,
    `nbAbs` INTEGER NULL,
    `groupHeader_id` INTEGER NOT NULL,

    INDEX `IDX_DE19258B2DFF238F`(`absence_id`),
    INDEX `IDX_DE19258B40C1FEA7`(`year_id`),
    INDEX `IDX_DE19258B8BF89464`(`groupHeader_id`),
    INDEX `IDX_DE19258B9BA9BF2B`(`studiant_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `archive_subscrib_group` (
    `id` INTEGER NOT NULL,
    `gift` BOOLEAN NULL,
    `user` VARCHAR(50) NULL,
    `groupHeader_id` INTEGER NOT NULL,
    `waiting` BOOLEAN NULL,
    `univers` VARCHAR(1) NULL,

    INDEX `IDX_6556DFE08BF89464`(`groupHeader_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `archive_subscrib_waiting` (
    `id` INTEGER NOT NULL,
    `subscrib` BOOLEAN NULL,
    `user` VARCHAR(50) NULL,
    `groupHeader_id` INTEGER NOT NULL,
    `univers` VARCHAR(1) NULL,

    INDEX `IDX_E7F41F138BF89464`(`groupHeader_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `archive_transcript` (
    `id` INTEGER NOT NULL,
    `studiant_id` INTEGER NULL,
    `year_id` INTEGER NULL,
    `average` DECIMAL(5, 1) NULL,
    `yearly` BOOLEAN NULL,
    `annual_average` DECIMAL(5, 1) NULL,
    `valid` BOOLEAN NULL,
    `next_step` BOOLEAN NULL,
    `semester` VARCHAR(2) NULL,
    `module_id` INTEGER NULL,
    `univers` VARCHAR(1) NULL,

    INDEX `IDX_6A65C12640C1FEA7`(`year_id`),
    INDEX `IDX_6A65C1269BA9BF2B`(`studiant_id`),
    INDEX `IDX_6A65C126AFC2B591`(`module_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `archive_transcript_content` (
    `id` INTEGER NOT NULL,
    `transcript_id` INTEGER NULL,
    `group_id` INTEGER NULL,
    `appreciation` LONGTEXT NULL,
    `average` DECIMAL(5, 1) NULL,
    `nb_abs` INTEGER NULL,
    `nb_justified_abs` INTEGER NULL,
    `valid` BOOLEAN NULL,
    `semester` VARCHAR(2) NULL,
    `module_id` INTEGER NULL,
    `univers` VARCHAR(1) NULL,

    INDEX `IDX_5445DF3FA4F53E3E`(`transcript_id`),
    INDEX `IDX_5445DF3FAFC2B591`(`module_id`),
    INDEX `IDX_5445DF3FFE54D947`(`group_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `archive_waiting_list` (
    `id` INTEGER NOT NULL,
    `studiant_id` INTEGER NULL,
    `inscription_date` DATE NOT NULL,
    `hierarchy` INTEGER NOT NULL,
    `comment` LONGTEXT NULL,
    `groupHeader_id` INTEGER NOT NULL,
    `internal` BOOLEAN NULL,
    `compta` BOOLEAN NULL,
    `multi` BOOLEAN NULL,
    `univers` VARCHAR(1) NULL,

    INDEX `IDX_A84A24808BF89464`(`groupHeader_id`),
    INDEX `IDX_A84A24809BA9BF2B`(`studiant_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `assessment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `studiant_id` INTEGER NOT NULL,
    `note` DECIMAL(4, 1) NULL,
    `note_org` DECIMAL(4, 1) NULL,
    `skill_description` VARCHAR(255) NULL,
    `assessHeader_id` INTEGER NOT NULL,
    `assessGranding_id` INTEGER NULL,
    `detail` BOOLEAN NULL,
    `page_from` INTEGER NULL,
    `page_validate` DECIMAL(4, 1) NULL,
    `page_to` INTEGER NULL,
    `nb_question` INTEGER NULL,
    `detail_valid` BOOLEAN NULL,
    `transcript` BOOLEAN NULL,
    `absent` BOOLEAN NULL,
    `sourateFrom_id` INTEGER NULL,
    `sourateTo_id` INTEGER NULL,
    `no_note` BOOLEAN NULL,
    `no_validate` BOOLEAN NULL,
    `univers` VARCHAR(1) NULL,

    INDEX `IDX_F7523D703D68839C`(`assessHeader_id`),
    INDEX `IDX_F7523D704AF02AB3`(`assessGranding_id`),
    INDEX `IDX_F7523D704E910A92`(`sourateTo_id`),
    INDEX `IDX_F7523D7055EF9145`(`sourateFrom_id`),
    INDEX `IDX_F7523D709BA9BF2B`(`studiant_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `assessment_coran_revision` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `question` VARCHAR(255) NULL,
    `no_granding` BOOLEAN NULL,
    `granding1` INTEGER NULL,
    `granding2` INTEGER NULL,
    `granding3` INTEGER NULL,
    `granding4` INTEGER NULL,
    `pages` DECIMAL(5, 2) NULL,
    `total` DECIMAL(5, 2) NULL,
    `assessment_id` INTEGER NULL,
    `univers` VARCHAR(1) NULL,

    INDEX `IDX_A4E1CC61DD3DD5F1`(`assessment_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `assessment_header` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `module_id` INTEGER NOT NULL,
    `date` DATE NOT NULL,
    `assessPattern_id` INTEGER NOT NULL,
    `groupHeader_id` INTEGER NOT NULL,
    `ratio_org` INTEGER NULL,
    `year_id` INTEGER NULL,
    `skill_description` VARCHAR(255) NULL,
    `assessGranding_id` INTEGER NULL,
    `transcript` BOOLEAN NULL,
    `semester` VARCHAR(2) NULL,
    `description` VARCHAR(255) NULL,
    `mode` VARCHAR(20) NULL,
    `univers` VARCHAR(1) NULL,

    INDEX `IDX_9AAF39AF40C1FEA7`(`year_id`),
    INDEX `IDX_9AAF39AF4AF02AB3`(`assessGranding_id`),
    INDEX `IDX_9AAF39AF8696B61A`(`assessPattern_id`),
    INDEX `IDX_9AAF39AF8BF89464`(`groupHeader_id`),
    INDEX `IDX_9AAF39AFAFC2B591`(`module_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `assessment_single_assessment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `studiant_id` INTEGER NOT NULL,
    `module_id` INTEGER NOT NULL,
    `year_id` INTEGER NULL,
    `description` VARCHAR(255) NULL,
    `date` DATE NOT NULL,
    `note_org` DECIMAL(4, 1) NULL,
    `note` DECIMAL(4, 1) NULL,
    `skill_description` VARCHAR(255) NULL,
    `page_from` INTEGER NULL,
    `page_to` INTEGER NULL,
    `page_validate` DECIMAL(4, 1) NULL,
    `detail` BOOLEAN NULL,
    `nb_question` INTEGER NULL,
    `detail_valid` BOOLEAN NULL,
    `ratio_org` INTEGER NULL,
    `mode` VARCHAR(20) NULL,
    `semester` VARCHAR(2) NULL,
    `transcript` BOOLEAN NULL,
    `absent` BOOLEAN NULL,
    `no_note` BOOLEAN NULL,
    `no_validate` BOOLEAN NULL,
    `univers` VARCHAR(1) NULL,
    `groupHeader_id` INTEGER NOT NULL,
    `assessGranding_id` INTEGER NULL,
    `assessPattern_id` INTEGER NOT NULL,
    `sourateFrom_id` INTEGER NULL,
    `sourateTo_id` INTEGER NULL,

    INDEX `IDX_3522790240C1FEA7`(`year_id`),
    INDEX `IDX_352279024AF02AB3`(`assessGranding_id`),
    INDEX `IDX_352279024E910A92`(`sourateTo_id`),
    INDEX `IDX_3522790255EF9145`(`sourateFrom_id`),
    INDEX `IDX_352279028696B61A`(`assessPattern_id`),
    INDEX `IDX_352279028BF89464`(`groupHeader_id`),
    INDEX `IDX_352279029BA9BF2B`(`studiant_id`),
    INDEX `IDX_35227902AFC2B591`(`module_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `assessment_single_coran_revision` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `assessment_id` INTEGER NULL,
    `question` VARCHAR(255) NULL,
    `no_granding` BOOLEAN NULL,
    `granding1` INTEGER NULL,
    `granding2` INTEGER NULL,
    `granding3` INTEGER NULL,
    `granding4` INTEGER NULL,
    `pages` DECIMAL(5, 2) NULL,
    `total` DECIMAL(5, 2) NULL,
    `univers` VARCHAR(1) NULL,

    INDEX `IDX_D7DB6D6DDD3DD5F1`(`assessment_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `assessment_transcript` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `studiant_id` INTEGER NULL,
    `year_id` INTEGER NULL,
    `average` DECIMAL(5, 1) NULL,
    `yearly` BOOLEAN NULL,
    `annual_average` DECIMAL(5, 1) NULL,
    `valid` BOOLEAN NULL,
    `semester` VARCHAR(2) NULL,
    `next_step` BOOLEAN NULL,
    `module_id` INTEGER NULL,
    `univers` VARCHAR(1) NULL,

    INDEX `IDX_198C86340C1FEA7`(`year_id`),
    INDEX `IDX_198C8639BA9BF2B`(`studiant_id`),
    INDEX `IDX_198C863AFC2B591`(`module_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `assessment_transcript_content` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `transcript_id` INTEGER NULL,
    `group_id` INTEGER NULL,
    `appreciation` LONGTEXT NULL,
    `average` DECIMAL(5, 1) NULL,
    `nb_abs` INTEGER NULL,
    `nb_justified_abs` INTEGER NULL,
    `valid` BOOLEAN NULL,
    `semester` VARCHAR(2) NULL,
    `module_id` INTEGER NULL,
    `univers` VARCHAR(1) NULL,

    INDEX `IDX_E74E1AFEA4F53E3E`(`transcript_id`),
    INDEX `IDX_E74E1AFEAFC2B591`(`module_id`),
    INDEX `IDX_E74E1AFEFE54D947`(`group_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `compta_centre_category` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `description` VARCHAR(255) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `compta_centre_receipts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `category_id` INTEGER NULL,
    `payment_id` INTEGER NULL,
    `year_id` INTEGER NULL,
    `date` DATE NULL,
    `amount` DECIMAL(7, 2) NULL,
    `chq_number` VARCHAR(50) NULL,
    `comment` LONGTEXT NULL,
    `proof_url` VARCHAR(255) NULL,
    `extension` VARCHAR(5) NULL,
    `reconciliation` BOOLEAN NULL,

    INDEX `IDX_A1D159A912469DE2`(`category_id`),
    INDEX `IDX_A1D159A940C1FEA7`(`year_id`),
    INDEX `IDX_A1D159A94C3A3BB`(`payment_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `compta_centre_spanding` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `category_id` INTEGER NULL,
    `payment_id` INTEGER NULL,
    `year_id` INTEGER NULL,
    `date` DATE NULL,
    `recipient` VARCHAR(255) NULL,
    `amount` DECIMAL(7, 2) NULL,
    `chq_number` VARCHAR(50) NULL,
    `comment` LONGTEXT NULL,
    `proof_url` VARCHAR(255) NULL,
    `extension` VARCHAR(5) NULL,
    `reconciliation` BOOLEAN NULL,

    INDEX `IDX_29EF14C012469DE2`(`category_id`),
    INDEX `IDX_29EF14C040C1FEA7`(`year_id`),
    INDEX `IDX_29EF14C04C3A3BB`(`payment_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `compta_student_bank` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `description` VARCHAR(100) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `compta_student_discount` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `year_id` INTEGER NOT NULL,
    `studiant_id` INTEGER NOT NULL,
    `cause` VARCHAR(255) NULL,
    `amount` DECIMAL(7, 2) NULL,
    `history_id` INTEGER NULL,
    `repayment` BOOLEAN NULL,
    `sup` BOOLEAN NULL,
    `date` DATE NULL,
    `payment_id` INTEGER NULL,
    `cheque_number` VARCHAR(20) NULL,
    `univers` VARCHAR(1) NULL,

    INDEX `IDX_3261B22E1E058452`(`history_id`),
    INDEX `IDX_3261B22E40C1FEA7`(`year_id`),
    INDEX `IDX_3261B22E4C3A3BB`(`payment_id`),
    INDEX `IDX_3261B22E9BA9BF2B`(`studiant_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `compta_student_due_motive` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `description` VARCHAR(255) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `compta_student_due_studiant` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `year_id` INTEGER NOT NULL,
    `studiant_id` INTEGER NOT NULL,
    `motive_id` INTEGER NULL,
    `univers` VARCHAR(1) NULL,

    INDEX `IDX_72A412F440C1FEA7`(`year_id`),
    INDEX `IDX_72A412F49658649C`(`motive_id`),
    INDEX `IDX_72A412F49BA9BF2B`(`studiant_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `compta_student_gain` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `year_id` INTEGER NOT NULL,
    `studiant_id` INTEGER NOT NULL,
    `calculated` DECIMAL(7, 2) NULL,
    `really` DECIMAL(7, 2) NULL,
    `history_id` INTEGER NULL,
    `sup` BOOLEAN NULL,
    `univers` VARCHAR(1) NULL,

    INDEX `IDX_9A305DA41E058452`(`history_id`),
    INDEX `IDX_9A305DA440C1FEA7`(`year_id`),
    INDEX `IDX_9A305DA49BA9BF2B`(`studiant_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `compta_student_schedule` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `payment_id` INTEGER NULL,
    `studiant_id` INTEGER NULL,
    `date` DATE NULL,
    `amount` DECIMAL(7, 2) NULL,
    `exchange` BOOLEAN NULL,
    `postponed` BOOLEAN NULL,
    `cheque_name` VARCHAR(100) NULL,
    `solded` BOOLEAN NULL,
    `cheque_number` VARCHAR(20) NULL,
    `history_id` INTEGER NULL,
    `sup` BOOLEAN NULL,
    `year_id` INTEGER NULL,
    `imp` BOOLEAN NULL,
    `imp_date` DATE NULL,
    `bankName_id` INTEGER NULL,
    `comparison` BOOLEAN NULL,
    `univers` VARCHAR(1) NULL,

    INDEX `IDX_89B917DB1E058452`(`history_id`),
    INDEX `IDX_89B917DB40C1FEA7`(`year_id`),
    INDEX `IDX_89B917DB4C3A3BB`(`payment_id`),
    INDEX `IDX_89B917DB67FC6DB4`(`bankName_id`),
    INDEX `IDX_89B917DB9BA9BF2B`(`studiant_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `compta_student_waiting_discount` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `year_id` INTEGER NOT NULL,
    `studiant_id` INTEGER NOT NULL,
    `history_id` INTEGER NULL,
    `date` DATE NULL,
    `cause` VARCHAR(255) NULL,
    `amount` DECIMAL(7, 2) NULL,
    `repayment` BOOLEAN NULL,
    `sup` BOOLEAN NULL,
    `univers` VARCHAR(1) NULL,

    INDEX `IDX_41737CBF1E058452`(`history_id`),
    INDEX `IDX_41737CBF40C1FEA7`(`year_id`),
    INDEX `IDX_41737CBF9BA9BF2B`(`studiant_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `compta_student_waiting_gain` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `year_id` INTEGER NOT NULL,
    `studiant_id` INTEGER NOT NULL,
    `history_id` INTEGER NULL,
    `calculated` DECIMAL(7, 2) NULL,
    `really` DECIMAL(7, 2) NULL,
    `sup` BOOLEAN NULL,
    `univers` VARCHAR(1) NULL,

    INDEX `IDX_E953BAAB1E058452`(`history_id`),
    INDEX `IDX_E953BAAB40C1FEA7`(`year_id`),
    INDEX `IDX_E953BAAB9BA9BF2B`(`studiant_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `compta_student_waiting_schedule` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `payment_id` INTEGER NULL,
    `year_id` INTEGER NULL,
    `studiant_id` INTEGER NULL,
    `history_id` INTEGER NULL,
    `date` DATE NULL,
    `amount` DECIMAL(7, 2) NULL,
    `exchange` BOOLEAN NULL,
    `postponed` BOOLEAN NULL,
    `cheque_name` VARCHAR(100) NULL,
    `solded` BOOLEAN NULL,
    `cheque_number` VARCHAR(20) NULL,
    `comparison` BOOLEAN NULL,
    `sup` BOOLEAN NULL,
    `imp` BOOLEAN NULL,
    `imp_date` DATE NULL,
    `bankName_id` INTEGER NULL,
    `univers` VARCHAR(1) NULL,

    INDEX `IDX_FAABD94A1E058452`(`history_id`),
    INDEX `IDX_FAABD94A40C1FEA7`(`year_id`),
    INDEX `IDX_FAABD94A4C3A3BB`(`payment_id`),
    INDEX `IDX_FAABD94A67FC6DB4`(`bankName_id`),
    INDEX `IDX_FAABD94A9BA9BF2B`(`studiant_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `learning_absence` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `description` VARCHAR(255) NULL,
    `code` VARCHAR(10) NULL,
    `sup` BOOLEAN NULL,

    UNIQUE INDEX `UNIQ_B2FD583A77153098`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `learning_agenda` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `groupHeader_id` INTEGER NULL,
    `date` DATE NULL,
    `assessment` BOOLEAN NULL,
    `attendance` BOOLEAN NULL,
    `year_id` INTEGER NULL,
    `control` BOOLEAN NULL,
    `att_valid` BOOLEAN NULL,
    `present` INTEGER NULL,
    `percent` DECIMAL(5, 2) NULL,
    `univers` VARCHAR(1) NULL,

    INDEX `IDX_EA1F838E40C1FEA7`(`year_id`),
    INDEX `IDX_EA1F838E8BF89464`(`groupHeader_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `learning_assess_type` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `description` VARCHAR(255) NULL,
    `code` VARCHAR(10) NULL,
    `sup` BOOLEAN NULL,
    `univers` VARCHAR(1) NULL,

    UNIQUE INDEX `UNIQ_D3B8C8D077153098`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `learning_coran_assess` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sourate_number` INTEGER NULL,
    `sourate_name` VARCHAR(50) NULL,
    `page_number` INTEGER NULL,
    `pages` DECIMAL(5, 2) NULL,
    `univers` VARCHAR(1) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `learning_history` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `event` VARCHAR(50) NULL,
    `date` DATETIME(0) NULL,
    `finish` BOOLEAN NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `learning_inactivity` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `year_id` INTEGER NOT NULL,
    `description` VARCHAR(255) NULL,
    `start_date` DATE NULL,
    `end_date` DATE NULL,
    `sup` BOOLEAN NULL,

    INDEX `IDX_40A3147F40C1FEA7`(`year_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `learning_payment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `description` VARCHAR(255) NULL,
    `code` VARCHAR(10) NULL,
    `hidden` BOOLEAN NULL,
    `sup` BOOLEAN NULL,

    UNIQUE INDEX `UNIQ_A98F3CFE77153098`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `learning_pricing` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `weekly_duration` INTEGER NULL,
    `normal_price` DECIMAL(7, 2) NULL,
    `reduct_price` DECIMAL(7, 2) NULL,
    `sup` BOOLEAN NULL,
    `duration_input` DECIMAL(5, 2) NULL,
    `pricingType_id` INTEGER NULL,
    `univers` VARCHAR(1) NULL,

    INDEX `IDX_215614C0695113B2`(`pricingType_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `learning_pricing_type` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `description` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `learning_year` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `description` VARCHAR(255) NULL,
    `archive` BOOLEAN NULL,
    `working_a` BOOLEAN NULL,
    `start_date` DATE NOT NULL,
    `end_start` DATE NOT NULL,
    `subscribtion_a` BOOLEAN NULL,
    `mail_to` BOOLEAN NULL,
    `s1_start_date` DATE NOT NULL,
    `s1_end_start` DATE NOT NULL,
    `s2_start_date` DATE NOT NULL,
    `s2_end_start` DATE NOT NULL,
    `sort` INTEGER NULL,
    `subscribtion_c` BOOLEAN NULL,
    `working_c` BOOLEAN NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `note` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NULL,
    `title` VARCHAR(255) NULL,
    `description` LONGTEXT NULL,
    `date` DATE NULL,
    `deleted` BOOLEAN NULL,
    `left_pos` INTEGER NULL,
    `top_pos` INTEGER NULL,
    `bg_color` VARCHAR(50) NULL,

    INDEX `IDX_CFBDFA14A76ED395`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pathway_assess_granding` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `description` VARCHAR(255) NULL,
    `goal` BOOLEAN NULL,
    `granding1` DECIMAL(5, 2) NULL,
    `granding2` DECIMAL(5, 2) NULL,
    `granding3` DECIMAL(5, 2) NULL,
    `granding4` DECIMAL(5, 2) NULL,
    `univers` VARCHAR(1) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pathway_assess_pattern` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `year_id` INTEGER NOT NULL,
    `description` VARCHAR(255) NULL,
    `start_date` DATE NULL,
    `end_date` DATE NULL,
    `factor` INTEGER NULL,
    `assessType_id` INTEGER NULL,
    `code` VARCHAR(10) NULL,
    `admin` BOOLEAN NULL,
    `department_id` INTEGER NULL,
    `univers` VARCHAR(1) NULL,
    `target` VARCHAR(5) NULL,

    INDEX `IDX_5ACA1AB940C1FEA7`(`year_id`),
    INDEX `IDX_5ACA1AB9A3A7EE89`(`assessType_id`),
    INDEX `IDX_5ACA1AB9AE80F5DF`(`department_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pathway_classroom` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `description` VARCHAR(255) NULL,
    `sup` BOOLEAN NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pathway_department` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pathway_id` INTEGER NOT NULL,
    `description` VARCHAR(255) NULL,
    `code` VARCHAR(10) NULL,
    `sup` BOOLEAN NULL,
    `dash` BOOLEAN NULL,
    `univers` VARCHAR(1) NULL,

    INDEX `IDX_FC25B097F3DA7551`(`pathway_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pathway_group_content` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `groupHeader_id` INTEGER NOT NULL,
    `studiant_id` INTEGER NOT NULL,
    `abort` BOOLEAN NULL,
    `next_level` BOOLEAN NULL,
    `swap` BOOLEAN NULL,
    `sup` BOOLEAN NULL,
    `history_id` INTEGER NULL,
    `date_abort` DATETIME(0) NULL,
    `resignation` BOOLEAN NULL,
    `entry_date` DATETIME(0) NULL,
    `motive` VARCHAR(255) NULL,
    `swapToGroup_id` INTEGER NULL,
    `univers` VARCHAR(1) NULL,
    `user` VARCHAR(100) NULL,
    `appreciation` LONGTEXT NULL,

    INDEX `IDX_E799803C1E058452`(`history_id`),
    INDEX `IDX_E799803C8BF89464`(`groupHeader_id`),
    INDEX `IDX_E799803C9BA9BF2B`(`studiant_id`),
    INDEX `IDX_E799803C9CC2EB2E`(`swapToGroup_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pathway_group_header` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `year_id` INTEGER NOT NULL,
    `classroom_id` INTEGER NOT NULL,
    `slot_id` INTEGER NOT NULL,
    `level_id` INTEGER NOT NULL,
    `description` VARCHAR(255) NULL,
    `code` VARCHAR(20) NULL,
    `max_male` INTEGER NULL,
    `max_female` INTEGER NULL,
    `nb_m_studiant` INTEGER NULL,
    `nb_f_studiant` INTEGER NULL,
    `sup` BOOLEAN NULL,
    `sel` BOOLEAN NULL,
    `valid` BOOLEAN NULL,
    `dash` BOOLEAN NULL,
    `mail_to` BOOLEAN NULL,
    `max_male_wait` INTEGER NULL,
    `max_female_wait` INTEGER NULL,
    `nb_m_studiant_wait` INTEGER NULL,
    `nb_f_studiant_wait` INTEGER NULL,
    `pricingType_id` INTEGER NULL,
    `module_id` INTEGER NULL,
    `univers` VARCHAR(1) NULL,
    `short_description` VARCHAR(255) NULL,
    `auto_valid` BOOLEAN NULL,
    `next_level` BOOLEAN NULL,
    `next_required` BOOLEAN NULL,

    INDEX `IDX_5EF44C5740C1FEA7`(`year_id`),
    INDEX `IDX_5EF44C5759E5119C`(`slot_id`),
    INDEX `IDX_5EF44C575FB14BA7`(`level_id`),
    INDEX `IDX_5EF44C576278D5A8`(`classroom_id`),
    INDEX `IDX_5EF44C57695113B2`(`pricingType_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pathway_group_module_teacher` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `groupHeader_id` INTEGER NULL,
    `module_id` INTEGER NULL,
    `teacher_id` INTEGER NULL,
    `sup` BOOLEAN NULL,
    `univers` VARCHAR(1) NULL,

    INDEX `IDX_6C45E8FD41807E1D`(`teacher_id`),
    INDEX `IDX_6C45E8FD8BF89464`(`groupHeader_id`),
    INDEX `IDX_6C45E8FDAFC2B591`(`module_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pathway_group_multiple` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `module_id` INTEGER NULL,
    `slot_id` INTEGER NULL,
    `sup` BOOLEAN NULL,
    `day` VARCHAR(2) NULL,
    `groupHeader_id` INTEGER NULL,

    INDEX `IDX_85CB467F59E5119C`(`slot_id`),
    INDEX `IDX_85CB467F8BF89464`(`groupHeader_id`),
    INDEX `IDX_85CB467FAFC2B591`(`module_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pathway_group_number` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATETIME(0) NULL,
    `numberM` INTEGER NULL,
    `numberF` INTEGER NULL,
    `groupHeader_id` INTEGER NOT NULL,
    `univers` VARCHAR(1) NULL,

    INDEX `IDX_A616FBC28BF89464`(`groupHeader_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pathway_level` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `department_id` INTEGER NOT NULL,
    `description` VARCHAR(255) NULL,
    `code` VARCHAR(10) NULL,
    `sexe` VARCHAR(1) NULL,
    `sup` BOOLEAN NULL,
    `dash` BOOLEAN NULL,
    `hierarchy` INTEGER NULL,
    `univers` VARCHAR(1) NULL,

    INDEX `IDX_DADF6579AE80F5DF`(`department_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pathway_module` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `description` VARCHAR(255) NULL,
    `code` VARCHAR(10) NULL,
    `sup` BOOLEAN NULL,
    `department_id` INTEGER NOT NULL,
    `start_date` DATE NULL,
    `end_date` DATE NULL,
    `sel` BOOLEAN NULL,
    `year_id` INTEGER NOT NULL,
    `close` BOOLEAN NULL,
    `univers` VARCHAR(1) NULL,

    INDEX `IDX_A1039BC740C1FEA7`(`year_id`),
    INDEX `IDX_A1039BC7AE80F5DF`(`department_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pathway_module_teacher` (
    `module_id` INTEGER NOT NULL,
    `teacher_id` INTEGER NOT NULL,

    INDEX `IDX_92C1EFC841807E1D`(`teacher_id`),
    INDEX `IDX_92C1EFC8AFC2B591`(`module_id`),
    PRIMARY KEY (`module_id`, `teacher_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pathway_pathway` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `description` VARCHAR(255) NULL,
    `code` VARCHAR(10) NULL,
    `sup` BOOLEAN NULL,
    `dash` BOOLEAN NULL,
    `univers` VARCHAR(1) NULL,

    UNIQUE INDEX `UNIQ_74F57FB677153098`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pathway_pattern_module` (
    `assesspattern_id` INTEGER NOT NULL,
    `module_id` INTEGER NOT NULL,

    INDEX `IDX_4CCBAD9CAFC2B591`(`module_id`),
    INDEX `IDX_4CCBAD9CC9CBB5CA`(`assesspattern_id`),
    PRIMARY KEY (`assesspattern_id`, `module_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pathway_slot` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `description` VARCHAR(255) NULL,
    `code` VARCHAR(10) NULL,
    `day` VARCHAR(10) NULL,
    `start_time` TIME(0) NULL,
    `end_time` TIME(0) NULL,
    `sup` BOOLEAN NULL,
    `duration_input` DECIMAL(5, 2) NULL,
    `weekly_duration` INTEGER NULL,
    `sort` INTEGER NULL,
    `dash` BOOLEAN NULL,
    `split_slot` BOOLEAN NULL,
    `day2` VARCHAR(10) NULL,
    `duration_input2` DECIMAL(5, 2) NULL,
    `start_time2` TIME(0) NULL,
    `end_time2` TIME(0) NULL,
    `pathway_id` INTEGER NOT NULL,
    `univers` VARCHAR(1) NULL,
    `split_slot_2` BOOLEAN NULL,
    `day3` VARCHAR(10) NULL,
    `duration_input3` DECIMAL(5, 2) NULL,
    `start_time3` TIME(0) NULL,
    `end_time3` TIME(0) NULL,

    INDEX `IDX_46AC2C8DF3DA7551`(`pathway_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pathway_teacher` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `contact_id` INTEGER NULL,
    `last_name` VARCHAR(70) NULL,
    `first_name` VARCHAR(70) NULL,
    `adresse` VARCHAR(255) NULL,
    `job` VARCHAR(255) NULL,
    `sup` BOOLEAN NULL,
    `sel` BOOLEAN NULL,
    `zip` VARCHAR(10) NULL,
    `city` VARCHAR(100) NULL,
    `sexe` VARCHAR(1) NULL,
    `univers` VARCHAR(1) NULL,

    INDEX `IDX_80EE7E81E7A1254A`(`contact_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pathway_teacher_department` (
    `teacher_id` INTEGER NOT NULL,
    `department_id` INTEGER NOT NULL,

    INDEX `IDX_5176912541807E1D`(`teacher_id`),
    INDEX `IDX_51769125AE80F5DF`(`department_id`),
    PRIMARY KEY (`teacher_id`, `department_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shatibi_events` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NULL,
    `url` VARCHAR(255) NULL,
    `bg_color` VARCHAR(50) NULL,
    `fg_color` VARCHAR(50) NULL,
    `start_datetime` DATETIME(0) NULL,
    `end_datetime` DATETIME(0) NULL,
    `allDay` BOOLEAN NULL,
    `user` VARCHAR(255) NULL,
    `description` LONGTEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `student` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `contact_id` INTEGER NULL,
    `last_name` VARCHAR(100) NULL,
    `first_name` VARCHAR(100) NULL,
    `sexe` VARCHAR(1) NULL,
    `birthday` DATE NOT NULL,
    `adresse` VARCHAR(255) NULL,
    `photo_url` VARCHAR(255) NULL,
    `pre_sub_date` DATE NULL,
    `subscrib_date` DATE NULL,
    `qualifications` VARCHAR(255) NULL,
    `job` VARCHAR(255) NULL,
    `pricing` VARCHAR(10) NULL,
    `family_status` VARCHAR(50) NULL,
    `know_centre` VARCHAR(255) NULL,
    `in_assoc` BOOLEAN NULL,
    `association` VARCHAR(255) NULL,
    `abort` BOOLEAN NULL,
    `comment` VARCHAR(255) NULL,
    `zip` VARCHAR(10) NULL,
    `city` VARCHAR(100) NULL,
    `extension` VARCHAR(5) NULL,
    `history_id` INTEGER NULL,
    `diploma` VARCHAR(100) NULL,
    `cause` VARCHAR(255) NULL,
    `dash_city` BOOLEAN NULL,
    `lastSubYear_id` INTEGER NULL,
    `archive` BOOLEAN NULL,
    `resignation` BOOLEAN NULL,
    `total` BOOLEAN NULL,
    `compta_comment` VARCHAR(255) NULL,
    `ask_compta_control` BOOLEAN NULL,
    `univers` VARCHAR(1) NULL,
    `school_level` VARCHAR(255) NULL,
    `responsible_last_name` VARCHAR(100) NULL,
    `responsible_first_name` VARCHAR(100) NULL,
    `responsible_quality` VARCHAR(10) NULL,
    `other_quality` VARCHAR(255) NULL,
    `particularity` VARCHAR(10) NULL,
    `other_particularity` VARCHAR(255) NULL,

    INDEX `IDX_B723AF331E058452`(`history_id`),
    INDEX `IDX_B723AF33D110123F`(`lastSubYear_id`),
    INDEX `IDX_B723AF33E7A1254A`(`contact_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `student_abort_motive` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `description` VARCHAR(255) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `student_attendance` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `absence_id` INTEGER NULL,
    `contact_id` INTEGER NULL,
    `date` DATE NULL,
    `present` BOOLEAN NULL,
    `comment` VARCHAR(255) NULL,
    `evidence` VARCHAR(255) NULL,
    `guest` BOOLEAN NULL,
    `groupHeader_id` INTEGER NOT NULL,
    `studiant_id` INTEGER NULL,
    `mail` BOOLEAN NULL,
    `abort` BOOLEAN NULL,
    `resignation` BOOLEAN NULL,
    `swap` BOOLEAN NULL,
    `univers` VARCHAR(1) NULL,
    `module_id` INTEGER NULL,

    INDEX `IDX_803CE0702DFF238F`(`absence_id`),
    INDEX `IDX_803CE0708BF89464`(`groupHeader_id`),
    INDEX `IDX_803CE0709BA9BF2B`(`studiant_id`),
    INDEX `IDX_803CE070AFC2B591`(`module_id`),
    INDEX `IDX_803CE070E7A1254A`(`contact_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `student_dash_days` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `monday` BOOLEAN NULL,
    `tuesday` BOOLEAN NULL,
    `wednesday` BOOLEAN NULL,
    `thursday` BOOLEAN NULL,
    `friday` BOOLEAN NULL,
    `saturday` BOOLEAN NULL,
    `sunday` BOOLEAN NULL,
    `name` VARCHAR(10) NULL,
    `mon_slot` BOOLEAN NULL,
    `tue_slot` BOOLEAN NULL,
    `wed_slot` BOOLEAN NULL,
    `thu_slot` BOOLEAN NULL,
    `fri_slot` BOOLEAN NULL,
    `sat_slot` BOOLEAN NULL,
    `sun_slot` BOOLEAN NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `student_dash_who` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(20) NULL,
    `inf_20` BOOLEAN NULL,
    `between_20_29` BOOLEAN NULL,
    `between_30_39` BOOLEAN NULL,
    `sup_40` BOOLEAN NULL,
    `av_bac` BOOLEAN NULL,
    `bac` BOOLEAN NULL,
    `bts` BOOLEAN NULL,
    `license` BOOLEAN NULL,
    `master` BOOLEAN NULL,
    `doctor` BOOLEAN NULL,
    `male` BOOLEAN NULL,
    `female` BOOLEAN NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `student_pre_subscrib` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `last_name` VARCHAR(100) NULL,
    `mail` VARCHAR(255) NULL,
    `mobile` VARCHAR(20) NULL,
    `rdv_object` VARCHAR(100) NULL,
    `studiant_past_year` VARCHAR(3) NULL,
    `pre_subscrib_date` DATETIME(0) NULL,
    `rdv_date` DATETIME(0) NULL,
    `sel` BOOLEAN NULL,
    `sup` BOOLEAN NULL,
    `subscib` BOOLEAN NULL,
    `first_name` VARCHAR(100) NULL,
    `gender` VARCHAR(1) NULL,
    `birth_date` DATE NULL,
    `adresse` VARCHAR(200) NULL,
    `zip` VARCHAR(10) NULL,
    `city` VARCHAR(100) NULL,
    `wp_post_id` BIGINT NULL,
    `univers` VARCHAR(1) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `student_stat_absence` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `studiant_id` INTEGER NULL,
    `year_id` INTEGER NULL,
    `startDate` DATE NULL,
    `endDate` DATE NULL,
    `nbAbs` INTEGER NULL,
    `groupHeader_id` INTEGER NOT NULL,
    `absence_id` INTEGER NULL,

    INDEX `IDX_B7E26E72DFF238F`(`absence_id`),
    INDEX `IDX_B7E26E740C1FEA7`(`year_id`),
    INDEX `IDX_B7E26E78BF89464`(`groupHeader_id`),
    INDEX `IDX_B7E26E79BA9BF2B`(`studiant_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `student_subscrib_group` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `gift` BOOLEAN NULL,
    `user` VARCHAR(50) NULL,
    `groupHeader_id` INTEGER NOT NULL,
    `waiting` BOOLEAN NULL,
    `univers` VARCHAR(1) NULL,

    INDEX `IDX_35177F968BF89464`(`groupHeader_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `student_subscrib_waiting` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `subscrib` BOOLEAN NULL,
    `user` VARCHAR(50) NULL,
    `groupHeader_id` INTEGER NOT NULL,
    `univers` VARCHAR(1) NULL,

    INDEX `IDX_484732CA8BF89464`(`groupHeader_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `student_waiting_list` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `studiant_id` INTEGER NULL,
    `inscription_date` DATE NOT NULL,
    `hierarchy` INTEGER NOT NULL,
    `comment` LONGTEXT NULL,
    `groupHeader_id` INTEGER NOT NULL,
    `internal` BOOLEAN NULL,
    `compta` BOOLEAN NULL,
    `multi` BOOLEAN NULL,
    `univers` VARCHAR(1) NULL,

    INDEX `IDX_7D2D27EC8BF89464`(`groupHeader_id`),
    INDEX `IDX_7D2D27EC9BA9BF2B`(`studiant_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `task` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NULL,
    `title` VARCHAR(255) NULL,
    `description` LONGTEXT NULL,
    `date` DATE NULL,
    `no_delete` BOOLEAN NULL,
    `done` BOOLEAN NULL,
    `deleted` BOOLEAN NULL,
    `clone_code` VARCHAR(12) NULL,
    `left_pos` INTEGER NULL,
    `top_pos` INTEGER NULL,

    INDEX `IDX_527EDB25A76ED395`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `admin_utilisateur` ADD CONSTRAINT `FK_3371EDC640C1FEA7` FOREIGN KEY (`year_id`) REFERENCES `learning_year`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `admin_utilisateur` ADD CONSTRAINT `FK_3371EDC641807E1D` FOREIGN KEY (`teacher_id`) REFERENCES `pathway_teacher`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `admin_utilisateur` ADD CONSTRAINT `FK_80062ABA9D9ECC71` FOREIGN KEY (`teacherChild_id`) REFERENCES `pathway_teacher`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `archive_agenda` ADD CONSTRAINT `FK_26335B5440C1FEA7` FOREIGN KEY (`year_id`) REFERENCES `learning_year`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `archive_agenda` ADD CONSTRAINT `FK_26335B548BF89464` FOREIGN KEY (`groupHeader_id`) REFERENCES `archive_group_header`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `archive_assess_header` ADD CONSTRAINT `FK_2C8727440C1FEA7` FOREIGN KEY (`year_id`) REFERENCES `learning_year`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `archive_assess_header` ADD CONSTRAINT `FK_2C872744AF02AB3` FOREIGN KEY (`assessGranding_id`) REFERENCES `pathway_assess_granding`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `archive_assess_header` ADD CONSTRAINT `FK_2C872748696B61A` FOREIGN KEY (`assessPattern_id`) REFERENCES `archive_assess_pattern`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `archive_assess_header` ADD CONSTRAINT `FK_2C872748BF89464` FOREIGN KEY (`groupHeader_id`) REFERENCES `archive_group_header`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `archive_assess_header` ADD CONSTRAINT `FK_2C87274AFC2B591` FOREIGN KEY (`module_id`) REFERENCES `archive_module`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `archive_assess_pattern` ADD CONSTRAINT `FK_18DB015740C1FEA7` FOREIGN KEY (`year_id`) REFERENCES `learning_year`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `archive_assess_pattern` ADD CONSTRAINT `FK_18DB0157A3A7EE89` FOREIGN KEY (`assessType_id`) REFERENCES `learning_assess_type`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `archive_assess_pattern` ADD CONSTRAINT `FK_18DB0157AE80F5DF` FOREIGN KEY (`department_id`) REFERENCES `pathway_department`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `archive_assessment` ADD CONSTRAINT `FK_45EE3A863D68839C` FOREIGN KEY (`assessHeader_id`) REFERENCES `archive_assess_header`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `archive_assessment` ADD CONSTRAINT `FK_45EE3A864AF02AB3` FOREIGN KEY (`assessGranding_id`) REFERENCES `pathway_assess_granding`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `archive_assessment` ADD CONSTRAINT `FK_45EE3A864E910A92` FOREIGN KEY (`sourateTo_id`) REFERENCES `learning_coran_assess`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `archive_assessment` ADD CONSTRAINT `FK_45EE3A8655EF9145` FOREIGN KEY (`sourateFrom_id`) REFERENCES `learning_coran_assess`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `archive_assessment` ADD CONSTRAINT `FK_45EE3A869BA9BF2B` FOREIGN KEY (`studiant_id`) REFERENCES `student`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `archive_attendance` ADD CONSTRAINT `FK_DF5F0A672DFF238F` FOREIGN KEY (`absence_id`) REFERENCES `learning_absence`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `archive_attendance` ADD CONSTRAINT `FK_DF5F0A678BF89464` FOREIGN KEY (`groupHeader_id`) REFERENCES `archive_group_header`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `archive_attendance` ADD CONSTRAINT `FK_DF5F0A679BA9BF2B` FOREIGN KEY (`studiant_id`) REFERENCES `student`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `archive_attendance` ADD CONSTRAINT `FK_DF5F0A67AFC2B591` FOREIGN KEY (`module_id`) REFERENCES `archive_module`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `archive_attendance` ADD CONSTRAINT `FK_DF5F0A67E7A1254A` FOREIGN KEY (`contact_id`) REFERENCES `admin_contact`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `archive_coran_revision` ADD CONSTRAINT `FK_F07696E6DD3DD5F1` FOREIGN KEY (`assessment_id`) REFERENCES `archive_assessment`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `archive_discount` ADD CONSTRAINT `FK_364F0B4F1E058452` FOREIGN KEY (`history_id`) REFERENCES `learning_history`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `archive_discount` ADD CONSTRAINT `FK_364F0B4F40C1FEA7` FOREIGN KEY (`year_id`) REFERENCES `learning_year`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `archive_discount` ADD CONSTRAINT `FK_364F0B4F4C3A3BB` FOREIGN KEY (`payment_id`) REFERENCES `learning_payment`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `archive_discount` ADD CONSTRAINT `FK_364F0B4F9BA9BF2B` FOREIGN KEY (`studiant_id`) REFERENCES `student`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `archive_due_studiant` ADD CONSTRAINT `FK_37DB8A3840C1FEA7` FOREIGN KEY (`year_id`) REFERENCES `learning_year`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `archive_due_studiant` ADD CONSTRAINT `FK_37DB8A389658649C` FOREIGN KEY (`motive_id`) REFERENCES `compta_student_due_motive`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `archive_due_studiant` ADD CONSTRAINT `FK_37DB8A389BA9BF2B` FOREIGN KEY (`studiant_id`) REFERENCES `student`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `archive_gain` ADD CONSTRAINT `FK_560F66ED1E058452` FOREIGN KEY (`history_id`) REFERENCES `learning_history`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `archive_gain` ADD CONSTRAINT `FK_560F66ED40C1FEA7` FOREIGN KEY (`year_id`) REFERENCES `learning_year`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `archive_gain` ADD CONSTRAINT `FK_560F66ED9BA9BF2B` FOREIGN KEY (`studiant_id`) REFERENCES `student`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `archive_group_content` ADD CONSTRAINT `FK_441A02151E058452` FOREIGN KEY (`history_id`) REFERENCES `learning_history`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `archive_group_content` ADD CONSTRAINT `FK_441A02158BF89464` FOREIGN KEY (`groupHeader_id`) REFERENCES `archive_group_header`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `archive_group_content` ADD CONSTRAINT `FK_441A02159BA9BF2B` FOREIGN KEY (`studiant_id`) REFERENCES `student`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `archive_group_content` ADD CONSTRAINT `FK_441A02159CC2EB2E` FOREIGN KEY (`swapToGroup_id`) REFERENCES `archive_group_header`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `archive_group_header` ADD CONSTRAINT `FK_6176113540C1FEA7` FOREIGN KEY (`year_id`) REFERENCES `learning_year`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `archive_group_header` ADD CONSTRAINT `FK_6176113559E5119C` FOREIGN KEY (`slot_id`) REFERENCES `pathway_slot`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `archive_group_header` ADD CONSTRAINT `FK_617611355FB14BA7` FOREIGN KEY (`level_id`) REFERENCES `pathway_level`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `archive_group_header` ADD CONSTRAINT `FK_617611356278D5A8` FOREIGN KEY (`classroom_id`) REFERENCES `pathway_classroom`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `archive_group_header` ADD CONSTRAINT `FK_61761135695113B2` FOREIGN KEY (`pricingType_id`) REFERENCES `learning_pricing_type`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `archive_group_module_teacher` ADD CONSTRAINT `FK_CC805DC841807E1D` FOREIGN KEY (`teacher_id`) REFERENCES `pathway_teacher`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `archive_group_module_teacher` ADD CONSTRAINT `FK_CC805DC88BF89464` FOREIGN KEY (`groupHeader_id`) REFERENCES `archive_group_header`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `archive_group_module_teacher` ADD CONSTRAINT `FK_CC805DC8AFC2B591` FOREIGN KEY (`module_id`) REFERENCES `archive_module`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `archive_group_multiple` ADD CONSTRAINT `FK_C7DA5D9159E5119C` FOREIGN KEY (`slot_id`) REFERENCES `pathway_slot`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `archive_group_multiple` ADD CONSTRAINT `FK_C7DA5D918BF89464` FOREIGN KEY (`groupHeader_id`) REFERENCES `archive_group_header`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `archive_group_multiple` ADD CONSTRAINT `FK_C7DA5D91AFC2B591` FOREIGN KEY (`module_id`) REFERENCES `archive_module`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `archive_group_number` ADD CONSTRAINT `FK_9994A6A08BF89464` FOREIGN KEY (`groupHeader_id`) REFERENCES `archive_group_header`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `archive_module` ADD CONSTRAINT `FK_6FAB50B40C1FEA7` FOREIGN KEY (`year_id`) REFERENCES `learning_year`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `archive_module` ADD CONSTRAINT `FK_6FAB50BAE80F5DF` FOREIGN KEY (`department_id`) REFERENCES `pathway_department`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `archive_module_teacher` ADD CONSTRAINT `FK_5C2E1A01AFC2B591` FOREIGN KEY (`module_id`) REFERENCES `archive_module`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `archive_module_teacher` ADD CONSTRAINT `FK_C20DB11841807E1D` FOREIGN KEY (`teacher_id`) REFERENCES `pathway_teacher`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `archive_pattern_module` ADD CONSTRAINT `FK_82245855AFC2B591` FOREIGN KEY (`module_id`) REFERENCES `archive_module`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `archive_pattern_module` ADD CONSTRAINT `FK_F5DE256CC9CBB5CA` FOREIGN KEY (`assesspattern_id`) REFERENCES `archive_assess_pattern`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `archive_schedule` ADD CONSTRAINT `FK_8D97AEBA1E058452` FOREIGN KEY (`history_id`) REFERENCES `learning_history`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `archive_schedule` ADD CONSTRAINT `FK_8D97AEBA40C1FEA7` FOREIGN KEY (`year_id`) REFERENCES `learning_year`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `archive_schedule` ADD CONSTRAINT `FK_8D97AEBA4C3A3BB` FOREIGN KEY (`payment_id`) REFERENCES `learning_payment`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `archive_schedule` ADD CONSTRAINT `FK_8D97AEBA67FC6DB4` FOREIGN KEY (`bankName_id`) REFERENCES `compta_student_bank`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `archive_schedule` ADD CONSTRAINT `FK_8D97AEBA9BA9BF2B` FOREIGN KEY (`studiant_id`) REFERENCES `student`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `archive_single_assessment` ADD CONSTRAINT `FK_FF67C76A40C1FEA7` FOREIGN KEY (`year_id`) REFERENCES `learning_year`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `archive_single_assessment` ADD CONSTRAINT `FK_FF67C76A4AF02AB3` FOREIGN KEY (`assessGranding_id`) REFERENCES `pathway_assess_granding`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `archive_single_assessment` ADD CONSTRAINT `FK_FF67C76A4E910A92` FOREIGN KEY (`sourateTo_id`) REFERENCES `learning_coran_assess`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `archive_single_assessment` ADD CONSTRAINT `FK_FF67C76A55EF9145` FOREIGN KEY (`sourateFrom_id`) REFERENCES `learning_coran_assess`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `archive_single_assessment` ADD CONSTRAINT `FK_FF67C76A8696B61A` FOREIGN KEY (`assessPattern_id`) REFERENCES `archive_assess_pattern`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `archive_single_assessment` ADD CONSTRAINT `FK_FF67C76A8BF89464` FOREIGN KEY (`groupHeader_id`) REFERENCES `archive_group_header`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `archive_single_assessment` ADD CONSTRAINT `FK_FF67C76A9BA9BF2B` FOREIGN KEY (`studiant_id`) REFERENCES `student`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `archive_single_assessment` ADD CONSTRAINT `FK_FF67C76AAFC2B591` FOREIGN KEY (`module_id`) REFERENCES `archive_module`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `archive_single_coran_revision` ADD CONSTRAINT `FK_1036F175DD3DD5F1` FOREIGN KEY (`assessment_id`) REFERENCES `archive_single_assessment`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `archive_stat_absence` ADD CONSTRAINT `FK_4E22F6742DFF238F` FOREIGN KEY (`absence_id`) REFERENCES `learning_absence`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `archive_stat_absence` ADD CONSTRAINT `FK_4E22F67440C1FEA7` FOREIGN KEY (`year_id`) REFERENCES `learning_year`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `archive_stat_absence` ADD CONSTRAINT `FK_4E22F6748BF89464` FOREIGN KEY (`groupHeader_id`) REFERENCES `archive_group_header`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `archive_stat_absence` ADD CONSTRAINT `FK_4E22F6749BA9BF2B` FOREIGN KEY (`studiant_id`) REFERENCES `student`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `archive_subscrib_group` ADD CONSTRAINT `FK_E9A831C78BF89464` FOREIGN KEY (`groupHeader_id`) REFERENCES `archive_group_header`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `archive_subscrib_waiting` ADD CONSTRAINT `FK_7A83EEF78BF89464` FOREIGN KEY (`groupHeader_id`) REFERENCES `archive_group_header`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `archive_transcript` ADD CONSTRAINT `FK_1A4A103540C1FEA7` FOREIGN KEY (`year_id`) REFERENCES `learning_year`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `archive_transcript` ADD CONSTRAINT `FK_1A4A10359BA9BF2B` FOREIGN KEY (`studiant_id`) REFERENCES `student`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `archive_transcript` ADD CONSTRAINT `FK_1A4A1035AFC2B591` FOREIGN KEY (`module_id`) REFERENCES `archive_module`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `archive_transcript_content` ADD CONSTRAINT `FK_A4EDB62AA4F53E3E` FOREIGN KEY (`transcript_id`) REFERENCES `archive_transcript`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `archive_transcript_content` ADD CONSTRAINT `FK_A4EDB62AAFC2B591` FOREIGN KEY (`module_id`) REFERENCES `archive_module`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `archive_transcript_content` ADD CONSTRAINT `FK_A4EDB62AFE54D947` FOREIGN KEY (`group_id`) REFERENCES `archive_group_header`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `archive_waiting_list` ADD CONSTRAINT `FK_3871F77F8BF89464` FOREIGN KEY (`groupHeader_id`) REFERENCES `archive_group_header`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `archive_waiting_list` ADD CONSTRAINT `FK_3871F77F9BA9BF2B` FOREIGN KEY (`studiant_id`) REFERENCES `student`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `assessment` ADD CONSTRAINT `FK_7E8F734B3D68839C` FOREIGN KEY (`assessHeader_id`) REFERENCES `assessment_header`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `assessment` ADD CONSTRAINT `FK_7E8F734B4AF02AB3` FOREIGN KEY (`assessGranding_id`) REFERENCES `pathway_assess_granding`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `assessment` ADD CONSTRAINT `FK_7E8F734B4E910A92` FOREIGN KEY (`sourateTo_id`) REFERENCES `learning_coran_assess`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `assessment` ADD CONSTRAINT `FK_7E8F734B55EF9145` FOREIGN KEY (`sourateFrom_id`) REFERENCES `learning_coran_assess`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `assessment` ADD CONSTRAINT `FK_7E8F734B9BA9BF2B` FOREIGN KEY (`studiant_id`) REFERENCES `student`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `assessment_coran_revision` ADD CONSTRAINT `FK_C6F7A5B0DD3DD5F1` FOREIGN KEY (`assessment_id`) REFERENCES `assessment`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `assessment_header` ADD CONSTRAINT `FK_80B1D2DE40C1FEA7` FOREIGN KEY (`year_id`) REFERENCES `learning_year`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `assessment_header` ADD CONSTRAINT `FK_80B1D2DE4AF02AB3` FOREIGN KEY (`assessGranding_id`) REFERENCES `pathway_assess_granding`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `assessment_header` ADD CONSTRAINT `FK_80B1D2DE8696B61A` FOREIGN KEY (`assessPattern_id`) REFERENCES `pathway_assess_pattern`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `assessment_header` ADD CONSTRAINT `FK_80B1D2DE8BF89464` FOREIGN KEY (`groupHeader_id`) REFERENCES `pathway_group_header`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `assessment_header` ADD CONSTRAINT `FK_80B1D2DEAFC2B591` FOREIGN KEY (`module_id`) REFERENCES `pathway_module`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `assessment_single_assessment` ADD CONSTRAINT `FK_F98243D840C1FEA7` FOREIGN KEY (`year_id`) REFERENCES `learning_year`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `assessment_single_assessment` ADD CONSTRAINT `FK_F98243D84AF02AB3` FOREIGN KEY (`assessGranding_id`) REFERENCES `pathway_assess_granding`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `assessment_single_assessment` ADD CONSTRAINT `FK_F98243D84E910A92` FOREIGN KEY (`sourateTo_id`) REFERENCES `learning_coran_assess`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `assessment_single_assessment` ADD CONSTRAINT `FK_F98243D855EF9145` FOREIGN KEY (`sourateFrom_id`) REFERENCES `learning_coran_assess`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `assessment_single_assessment` ADD CONSTRAINT `FK_F98243D88696B61A` FOREIGN KEY (`assessPattern_id`) REFERENCES `pathway_assess_pattern`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `assessment_single_assessment` ADD CONSTRAINT `FK_F98243D88BF89464` FOREIGN KEY (`groupHeader_id`) REFERENCES `pathway_group_header`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `assessment_single_assessment` ADD CONSTRAINT `FK_F98243D89BA9BF2B` FOREIGN KEY (`studiant_id`) REFERENCES `student`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `assessment_single_assessment` ADD CONSTRAINT `FK_F98243D8AFC2B591` FOREIGN KEY (`module_id`) REFERENCES `pathway_module`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `assessment_single_coran_revision` ADD CONSTRAINT `FK_8B1B66A4DD3DD5F1` FOREIGN KEY (`assessment_id`) REFERENCES `assessment_single_assessment`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `assessment_transcript` ADD CONSTRAINT `FK_212B59F840C1FEA7` FOREIGN KEY (`year_id`) REFERENCES `learning_year`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `assessment_transcript` ADD CONSTRAINT `FK_212B59F89BA9BF2B` FOREIGN KEY (`studiant_id`) REFERENCES `student`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `assessment_transcript` ADD CONSTRAINT `FK_212B59F8AFC2B591` FOREIGN KEY (`module_id`) REFERENCES `pathway_module`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `assessment_transcript_content` ADD CONSTRAINT `FK_8184810EA4F53E3E` FOREIGN KEY (`transcript_id`) REFERENCES `assessment_transcript`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `assessment_transcript_content` ADD CONSTRAINT `FK_8184810EAFC2B591` FOREIGN KEY (`module_id`) REFERENCES `pathway_module`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `assessment_transcript_content` ADD CONSTRAINT `FK_8184810EFE54D947` FOREIGN KEY (`group_id`) REFERENCES `pathway_group_header`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `compta_centre_receipts` ADD CONSTRAINT `FK_183BEA8E12469DE2` FOREIGN KEY (`category_id`) REFERENCES `compta_centre_category`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `compta_centre_receipts` ADD CONSTRAINT `FK_183BEA8E40C1FEA7` FOREIGN KEY (`year_id`) REFERENCES `learning_year`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `compta_centre_receipts` ADD CONSTRAINT `FK_183BEA8E4C3A3BB` FOREIGN KEY (`payment_id`) REFERENCES `learning_payment`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `compta_centre_spanding` ADD CONSTRAINT `FK_9005A7E712469DE2` FOREIGN KEY (`category_id`) REFERENCES `compta_centre_category`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `compta_centre_spanding` ADD CONSTRAINT `FK_9005A7E740C1FEA7` FOREIGN KEY (`year_id`) REFERENCES `learning_year`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `compta_centre_spanding` ADD CONSTRAINT `FK_9005A7E74C3A3BB` FOREIGN KEY (`payment_id`) REFERENCES `learning_payment`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `compta_student_discount` ADD CONSTRAINT `FK_CB0EA461E058452` FOREIGN KEY (`history_id`) REFERENCES `learning_history`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `compta_student_discount` ADD CONSTRAINT `FK_CB0EA4640C1FEA7` FOREIGN KEY (`year_id`) REFERENCES `learning_year`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `compta_student_discount` ADD CONSTRAINT `FK_CB0EA464C3A3BB` FOREIGN KEY (`payment_id`) REFERENCES `learning_payment`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `compta_student_discount` ADD CONSTRAINT `FK_CB0EA469BA9BF2B` FOREIGN KEY (`studiant_id`) REFERENCES `student`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `compta_student_due_studiant` ADD CONSTRAINT `FK_B7DB5BE540C1FEA7` FOREIGN KEY (`year_id`) REFERENCES `learning_year`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `compta_student_due_studiant` ADD CONSTRAINT `FK_B7DB5BE59658649C` FOREIGN KEY (`motive_id`) REFERENCES `compta_student_due_motive`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `compta_student_due_studiant` ADD CONSTRAINT `FK_B7DB5BE59BA9BF2B` FOREIGN KEY (`studiant_id`) REFERENCES `student`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `compta_student_gain` ADD CONSTRAINT `FK_C0F4DCB1E058452` FOREIGN KEY (`history_id`) REFERENCES `learning_history`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `compta_student_gain` ADD CONSTRAINT `FK_C0F4DCB40C1FEA7` FOREIGN KEY (`year_id`) REFERENCES `learning_year`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `compta_student_gain` ADD CONSTRAINT `FK_C0F4DCB9BA9BF2B` FOREIGN KEY (`studiant_id`) REFERENCES `student`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `compta_student_schedule` ADD CONSTRAINT `FK_B7684FB31E058452` FOREIGN KEY (`history_id`) REFERENCES `learning_history`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `compta_student_schedule` ADD CONSTRAINT `FK_B7684FB340C1FEA7` FOREIGN KEY (`year_id`) REFERENCES `learning_year`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `compta_student_schedule` ADD CONSTRAINT `FK_B7684FB34C3A3BB` FOREIGN KEY (`payment_id`) REFERENCES `learning_payment`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `compta_student_schedule` ADD CONSTRAINT `FK_B7684FB367FC6DB4` FOREIGN KEY (`bankName_id`) REFERENCES `compta_student_bank`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `compta_student_schedule` ADD CONSTRAINT `FK_B7684FB39BA9BF2B` FOREIGN KEY (`studiant_id`) REFERENCES `student`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `compta_student_waiting_discount` ADD CONSTRAINT `FK_9534A90C1E058452` FOREIGN KEY (`history_id`) REFERENCES `learning_history`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `compta_student_waiting_discount` ADD CONSTRAINT `FK_9534A90C40C1FEA7` FOREIGN KEY (`year_id`) REFERENCES `learning_year`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `compta_student_waiting_discount` ADD CONSTRAINT `FK_9534A90C9BA9BF2B` FOREIGN KEY (`studiant_id`) REFERENCES `student`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `compta_student_waiting_gain` ADD CONSTRAINT `FK_2C2CF3BA1E058452` FOREIGN KEY (`history_id`) REFERENCES `learning_history`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `compta_student_waiting_gain` ADD CONSTRAINT `FK_2C2CF3BA40C1FEA7` FOREIGN KEY (`year_id`) REFERENCES `learning_year`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `compta_student_waiting_gain` ADD CONSTRAINT `FK_2C2CF3BA9BA9BF2B` FOREIGN KEY (`studiant_id`) REFERENCES `student`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `compta_student_waiting_schedule` ADD CONSTRAINT `FK_2EEC0CF91E058452` FOREIGN KEY (`history_id`) REFERENCES `learning_history`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `compta_student_waiting_schedule` ADD CONSTRAINT `FK_2EEC0CF940C1FEA7` FOREIGN KEY (`year_id`) REFERENCES `learning_year`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `compta_student_waiting_schedule` ADD CONSTRAINT `FK_2EEC0CF94C3A3BB` FOREIGN KEY (`payment_id`) REFERENCES `learning_payment`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `compta_student_waiting_schedule` ADD CONSTRAINT `FK_2EEC0CF967FC6DB4` FOREIGN KEY (`bankName_id`) REFERENCES `compta_student_bank`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `compta_student_waiting_schedule` ADD CONSTRAINT `FK_2EEC0CF99BA9BF2B` FOREIGN KEY (`studiant_id`) REFERENCES `student`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `learning_agenda` ADD CONSTRAINT `FK_7749003C40C1FEA7` FOREIGN KEY (`year_id`) REFERENCES `learning_year`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `learning_agenda` ADD CONSTRAINT `FK_7749003CEE4A4339` FOREIGN KEY (`groupHeader_id`) REFERENCES `pathway_group_header`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `learning_inactivity` ADD CONSTRAINT `FK_76F4229C40C1FEA7` FOREIGN KEY (`year_id`) REFERENCES `learning_year`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `learning_pricing` ADD CONSTRAINT `FK_4A490E3695113B2` FOREIGN KEY (`pricingType_id`) REFERENCES `learning_pricing_type`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `note` ADD CONSTRAINT `FK_CFBDFA14A76ED395` FOREIGN KEY (`user_id`) REFERENCES `admin_utilisateur`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `pathway_assess_pattern` ADD CONSTRAINT `FK_95CDCFC840C1FEA7` FOREIGN KEY (`year_id`) REFERENCES `learning_year`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `pathway_assess_pattern` ADD CONSTRAINT `FK_95CDCFC8A3A7EE89` FOREIGN KEY (`assessType_id`) REFERENCES `learning_assess_type`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `pathway_assess_pattern` ADD CONSTRAINT `FK_95CDCFC8AE80F5DF` FOREIGN KEY (`department_id`) REFERENCES `pathway_department`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `pathway_department` ADD CONSTRAINT `FK_286608DFF3DA7551` FOREIGN KEY (`pathway_id`) REFERENCES `pathway_pathway`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `pathway_group_content` ADD CONSTRAINT `FK_5AD9680A1E058452` FOREIGN KEY (`history_id`) REFERENCES `learning_history`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `pathway_group_content` ADD CONSTRAINT `FK_5AD9680A9BA9BF2B` FOREIGN KEY (`studiant_id`) REFERENCES `student`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `pathway_group_content` ADD CONSTRAINT `FK_5AD9680A9CC2EB2E` FOREIGN KEY (`swapToGroup_id`) REFERENCES `pathway_group_header`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `pathway_group_content` ADD CONSTRAINT `FK_5AD9680AEE4A4339` FOREIGN KEY (`groupHeader_id`) REFERENCES `pathway_group_header`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `pathway_group_header` ADD CONSTRAINT `FK_A3EE66A740C1FEA7` FOREIGN KEY (`year_id`) REFERENCES `learning_year`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `pathway_group_header` ADD CONSTRAINT `FK_A3EE66A759E5119C` FOREIGN KEY (`slot_id`) REFERENCES `pathway_slot`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `pathway_group_header` ADD CONSTRAINT `FK_A3EE66A75FB14BA7` FOREIGN KEY (`level_id`) REFERENCES `pathway_level`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `pathway_group_header` ADD CONSTRAINT `FK_A3EE66A76278D5A8` FOREIGN KEY (`classroom_id`) REFERENCES `pathway_classroom`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `pathway_group_header` ADD CONSTRAINT `FK_A3EE66A7695113B2` FOREIGN KEY (`pricingType_id`) REFERENCES `learning_pricing_type`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `pathway_group_module_teacher` ADD CONSTRAINT `FK_EA0A2F7441807E1D` FOREIGN KEY (`teacher_id`) REFERENCES `pathway_teacher`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `pathway_group_module_teacher` ADD CONSTRAINT `FK_EA0A2F74AFC2B591` FOREIGN KEY (`module_id`) REFERENCES `pathway_module`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `pathway_group_module_teacher` ADD CONSTRAINT `FK_EA0A2F74EE4A4339` FOREIGN KEY (`groupHeader_id`) REFERENCES `pathway_group_header`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `pathway_group_multiple` ADD CONSTRAINT `FK_4ACC930E59E5119C` FOREIGN KEY (`slot_id`) REFERENCES `pathway_slot`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `pathway_group_multiple` ADD CONSTRAINT `FK_4ACC930E8BF89464` FOREIGN KEY (`groupHeader_id`) REFERENCES `pathway_group_header`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `pathway_group_multiple` ADD CONSTRAINT `FK_4ACC930EAFC2B591` FOREIGN KEY (`module_id`) REFERENCES `pathway_module`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `pathway_group_number` ADD CONSTRAINT `FK_5B0CD1328BF89464` FOREIGN KEY (`groupHeader_id`) REFERENCES `pathway_group_header`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `pathway_level` ADD CONSTRAINT `FK_E08C9AACAE80F5DF` FOREIGN KEY (`department_id`) REFERENCES `pathway_department`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `pathway_module` ADD CONSTRAINT `FK_5780EE6340C1FEA7` FOREIGN KEY (`year_id`) REFERENCES `learning_year`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `pathway_module` ADD CONSTRAINT `FK_5780EE63AE80F5DF` FOREIGN KEY (`department_id`) REFERENCES `pathway_department`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `pathway_module_teacher` ADD CONSTRAINT `FK_1B8D98CC41807E1D` FOREIGN KEY (`teacher_id`) REFERENCES `pathway_teacher`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `pathway_module_teacher` ADD CONSTRAINT `FK_1B8D98CCAFC2B591` FOREIGN KEY (`module_id`) REFERENCES `pathway_module`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `pathway_pattern_module` ADD CONSTRAINT `FK_CF389180AFC2B591` FOREIGN KEY (`module_id`) REFERENCES `pathway_module`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `pathway_pattern_module` ADD CONSTRAINT `FK_CF389180C9CBB5CA` FOREIGN KEY (`assesspattern_id`) REFERENCES `pathway_assess_pattern`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `pathway_slot` ADD CONSTRAINT `FK_A00237ECF3DA7551` FOREIGN KEY (`pathway_id`) REFERENCES `pathway_pathway`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `pathway_teacher` ADD CONSTRAINT `FK_51A39A05E7A1254A` FOREIGN KEY (`contact_id`) REFERENCES `admin_contact`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `pathway_teacher_department` ADD CONSTRAINT `FK_4702432A41807E1D` FOREIGN KEY (`teacher_id`) REFERENCES `pathway_teacher`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `pathway_teacher_department` ADD CONSTRAINT `FK_4702432AAE80F5DF` FOREIGN KEY (`department_id`) REFERENCES `pathway_department`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `student` ADD CONSTRAINT `FK_75F9B1471E058452` FOREIGN KEY (`history_id`) REFERENCES `learning_history`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `student` ADD CONSTRAINT `FK_75F9B147D110123F` FOREIGN KEY (`lastSubYear_id`) REFERENCES `learning_year`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `student` ADD CONSTRAINT `FK_75F9B147E7A1254A` FOREIGN KEY (`contact_id`) REFERENCES `admin_contact`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `student_attendance` ADD CONSTRAINT `FK_E43E43AA2DFF238F` FOREIGN KEY (`absence_id`) REFERENCES `learning_absence`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `student_attendance` ADD CONSTRAINT `FK_E43E43AA8BF89464` FOREIGN KEY (`groupHeader_id`) REFERENCES `pathway_group_header`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `student_attendance` ADD CONSTRAINT `FK_E43E43AA9BA9BF2B` FOREIGN KEY (`studiant_id`) REFERENCES `student`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `student_attendance` ADD CONSTRAINT `FK_E43E43AAAFC2B591` FOREIGN KEY (`module_id`) REFERENCES `pathway_module`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `student_attendance` ADD CONSTRAINT `FK_E43E43AAE7A1254A` FOREIGN KEY (`contact_id`) REFERENCES `admin_contact`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `student_stat_absence` ADD CONSTRAINT `FK_92A097502DFF238F` FOREIGN KEY (`absence_id`) REFERENCES `learning_absence`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `student_stat_absence` ADD CONSTRAINT `FK_92A0975040C1FEA7` FOREIGN KEY (`year_id`) REFERENCES `learning_year`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `student_stat_absence` ADD CONSTRAINT `FK_92A097508BF89464` FOREIGN KEY (`groupHeader_id`) REFERENCES `pathway_group_header`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `student_stat_absence` ADD CONSTRAINT `FK_92A097509BA9BF2B` FOREIGN KEY (`studiant_id`) REFERENCES `student`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `student_subscrib_group` ADD CONSTRAINT `FK_DF2902918BF89464` FOREIGN KEY (`groupHeader_id`) REFERENCES `pathway_group_header`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `student_subscrib_waiting` ADD CONSTRAINT `FK_29B243B28BF89464` FOREIGN KEY (`groupHeader_id`) REFERENCES `pathway_group_header`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `student_waiting_list` ADD CONSTRAINT `FK_49259C298BF89464` FOREIGN KEY (`groupHeader_id`) REFERENCES `pathway_group_header`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `student_waiting_list` ADD CONSTRAINT `FK_49259C299BA9BF2B` FOREIGN KEY (`studiant_id`) REFERENCES `student`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `task` ADD CONSTRAINT `FK_527EDB25A76ED395` FOREIGN KEY (`user_id`) REFERENCES `admin_utilisateur`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
