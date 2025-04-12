<form action="{{ route('smtp-config.store') }}" method="POST">
    @csrf
    <div>
        <label for="mail_username">Mail Username:</label>
        <input type="email" name="mail_username" id="mail_username" required>
    </div>
    <div>
        <label for="mail_password">Mail Password:</label>
        <input type="password" name="mail_password" id="mail_password" required>
    </div>
    <div>
        <label for="mail_from_address">Mail From Address:</label>
        <input type="email" name="mail_from_address" id="mail_from_address" required>
    </div>
    <button type="submit">Save</button>
</form>